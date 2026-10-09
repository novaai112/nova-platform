import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpenText, ExternalLink, LoaderCircle, Search } from 'lucide-react';
import { getArticleById } from '../data/docArticles.js';

const ANALYSIS_MODULES = [
  { id: 'nozzle-analysis', title: 'Nozzle', file: 'Nozzle8.html' },
  { id: 'bellows-analysis', title: 'Bellows', file: 'bellow.html' },
  { id: 'flange-analysis', title: 'Flange', file: 'flange.html' },
  { id: 'local-pwht', title: 'PWHT', file: 'pwht.html' },
  { id: 'saddle-analysis', title: 'Saddle', file: 'saddle.html' },
  { id: 'hot-box-analysis', title: 'Hot box', file: 'hot.html' },
  { id: 'stiffener-analysis', title: 'Stiffener', file: 'stiffener.html' },
  { id: 'tubesheet-analysis', title: 'Tubesheet', file: 'tubesheet.html' },
  { id: 'lug-analysis', title: 'Lifting lug', file: 'lug.html' },
  { id: 'trunnion-analysis', title: 'Trunnion', file: 'trunnion.html' }
];

function stripMarkup(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function describeInput(field, article) {
  const existing = article?.parameters?.find(parameter =>
    parameter.name.toLowerCase() === field.name.toLowerCase() ||
    parameter.label.toLowerCase() === field.label.toLowerCase()
  );
  if (existing?.meaning) return existing.meaning;

  const label = field.label.toLowerCase();
  if (label.includes('material')) {
    return 'Select the material grade for this component. Confirm its specification and grade against the project material records; temperature-dependent properties may be used by the analysis.';
  }
  if (label.includes('temp') || label.includes('temperature')) {
    return 'Enter the temperature for the named design, operating, or boundary condition. Use the project design basis because temperature can affect material properties and thermal loading.';
  }
  if (label.includes('pressure')) {
    return 'Enter the pressure for the named side or condition. Check the stated unit and case, and do not substitute an operating pressure for a design pressure unless the form requests it.';
  }
  if (/force|load|moment|thrust|lifting|pretension|sling/.test(label)) {
    return 'Enter the named applied load or reaction from the approved load basis. Check its direction, sign convention, coordinate system, and displayed unit before solving.';
  }
  if (/mesh|sizing|division|refinement|edge sizing/.test(label)) {
    return 'Controls finite-element mesh resolution for the named body or region. Use a mesh fine enough to resolve local geometry and verify that important results are mesh-converged.';
  }
  if (/corrosion/.test(label)) {
    return 'Enter the corrosion allowance assigned to this pressure-boundary component. Keep it consistent with the project specification and the thickness basis used by the calculation.';
  }
  if (/type|profile|case|method|orientation|required|wear plate|variation|edition/.test(label)) {
    return 'Choose the configuration used by this analysis. The selection may change which geometry or condition inputs are applicable; complete the fields shown for the selected option.';
  }
  if (/diameter|\b(dia|od|id)\b|thk|thickness|width|height|length|pitch|radius|offset|location|elevation|projection|hole|plate|rib|ring|convolution/.test(label)) {
    return 'Enter the named component dimension from the current drawing or equipment specification. Use the displayed unit, distinguish inside from outside dimensions, and account for the selected configuration.';
  }
  if (/coefficient|emissivity|friction|density|factor|ratio|angle|percentage|percent|time|rate/.test(label)) {
    return 'Enter the specified property or condition for this model. Check the project basis, applicable units, and any dependent configuration before running the analysis.';
  }
  if (/folder|path/.test(label)) {
    return 'Sets the analysis working-folder location used by the form. Choose the project folder expected by the local analysis workflow.';
  }
  return 'Enter the value requested by this HTML form and confirm it against the applicable drawing, specification, or analysis case before submitting.';
}

function parseConfiguredFields(source) {
  const fields = [];
  const pattern = /\{\s*name:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*type:\s*"([^"]+)"([^}]*)\}/g;
  const appDataAt = source.indexOf('const appData');
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const [, name, rawLabel, type, rest] = match;
    const unit = rest.match(/unit:\s*"([^"]+)"/)?.[1] || rawLabel.match(/\(([^)]+)\)/)?.[1] || '';
    const optionsText = rest.match(/options:\s*\[([^\]]*)\]/)?.[1];
    const options = optionsText?.match(/"([^"]+)"/g)?.map(option => option.slice(1, -1)) || [];
    const condition = rest.match(/showIf:\s*\[([^\]]*)\]/)?.[1]
      ?.match(/"([^"]+)"/g)?.map(option => option.slice(1, -1)).join(', ');
    const beforeField = source.slice(appDataAt < 0 ? 0 : appDataAt, match.index);
    const headings = [...beforeField.matchAll(/title:\s*"([^"]+)"/g)];

    fields.push({
      name,
      label: rawLabel.replace(/:$/, '').replace(/\s+/g, ' ').trim(),
      type,
      unit,
      options,
      condition,
      group: headings.at(-1)?.[1]?.replace(/^\d+\.\s*/, '') || 'Analysis inputs'
    });
  }

  return fields;
}

function parseTemplateFields(source) {
  const fields = [];
  const pattern = /<label\b[^>]*class=["']form-label["'][^>]*>([\s\S]*?)<\/label>([\s\S]{0,900}?)(<(?:input|select)\b[^>]*>)/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const [, rawLabel, , tag] = match;
    const name = tag.match(/\bname=["']([^"']+)["']/)?.[1] || tag.match(/\bid=["']([^"']+)["']/)?.[1];
    const type = tag.startsWith('<select') ? 'select' : tag.match(/\btype=["']([^"']+)["']/)?.[1] || 'text';
    if (!name || type === 'hidden' || type === 'file') continue;

    const controlStart = match.index + match[0].lastIndexOf(tag);
    const controlEnd = source.indexOf('</div>', controlStart);
    const controlRegion = source.slice(controlStart, controlEnd < 0 ? controlStart + 500 : controlEnd);
    const selectMarkup = type === 'select'
      ? source.slice(controlStart).match(/^<select\b[^>]*>[\s\S]*?<\/select>/)?.[0] || tag
      : '';
    const unit = controlRegion.match(/class=["']addon["'][^>]*>\s*([^<]+)/)?.[1]?.trim() || '';
    const options = type === 'select'
      ? [...selectMarkup.matchAll(/<option\b[^>]*>([^<]+)<\/option>/g)].map(option => option[1].trim())
      : [];
    const before = source.slice(Math.max(0, match.index - 800), match.index);
    const condition = before.match(/dependsOn:\s*"[^"]+",\s*showIf:\s*\[([^\]]+)\]/)?.[1]
      ?.match(/"([^"]+)"/g)?.map(option => option.slice(1, -1)).join(', ');
    const priorMarkup = source.slice(Math.max(0, match.index - 1000), match.index);
    const groupMatches = [...priorMarkup.matchAll(/class=["'](?:col-title|section-label|card-header)["'][^>]*>([\s\S]*?)<\/(?:div|span)>/g)];

    fields.push({
      name,
      label: stripMarkup(rawLabel).replace(/\s+/g, ' ').trim(),
      type,
      unit,
      options,
      condition,
      group: groupMatches.length ? stripMarkup(groupMatches.at(-1)[1]) : 'Analysis inputs'
    });
  }

  return fields;
}

function parseModuleFields(source, moduleId) {
  if (moduleId === 'nozzle-analysis') {
    const templates = [
      ['Shell nozzle form', source.slice(source.indexOf('function getShellFormTemplate'), source.indexOf('function getHeadFormTemplate'))],
      ['Head nozzle form', source.slice(source.indexOf('function getHeadFormTemplate'))]
    ];
    return templates.flatMap(([group, template]) =>
      parseTemplateFields(template).map(field => ({ ...field, group }))
    );
  }

  const configured = parseConfiguredFields(source);
  if (configured.length) return configured;
  return parseTemplateFields(source).map(field => ({ ...field, group: 'Analysis inputs' }));
}

function deduplicateFields(fields) {
  const seen = new Set();
  return fields.filter(field => {
    const key = `${field.name}|${field.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function useModuleInputs(moduleId) {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const selectedModules = moduleId
      ? ANALYSIS_MODULES.filter(module => module.id === moduleId)
      : ANALYSIS_MODULES;

    if (moduleId && selectedModules.length === 0) {
      setModules([]);
      setError(`No HTML input form is registered for "${moduleId}".`);
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);
    setError('');
    Promise.all(selectedModules.map(async module => {
      const response = await fetch(`/${module.file}`);
      if (!response.ok) {
        throw new Error(`Could not load /${module.file} (${response.status}).`);
      }
      const source = await response.text();
      const fields = deduplicateFields(parseModuleFields(source, module.id));
      if (!fields.length) {
        throw new Error(`No form inputs were found in /${module.file}.`);
      }
      return { ...module, fields, article: getArticleById(module.id) };
    })).then(result => {
      if (!cancelled) setModules(result);
    }).catch(caught => {
      if (!cancelled) setError(caught.message || 'Unable to load the HTML input references.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [moduleId]);

  return { modules, error, loading };
}

function InputTable({ module }) {
  const groups = useMemo(() => module.fields.reduce((result, field) => {
    const group = field.group || 'Analysis inputs';
    (result[group] ||= []).push(field);
    return result;
  }, {}), [module.fields]);
  const articleParameters = module.article?.parameters || [];

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([group, fields]) => (
        <section key={group} className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">{group}</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[44rem] border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">HTML input</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">Control name</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">Unit / choices</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">What to enter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fields.map((field, index) => {
                  const matchingArticleParameter = articleParameters.find(parameter =>
                    parameter.name.toLowerCase() === field.name.toLowerCase() ||
                    parameter.label.toLowerCase() === field.label.toLowerCase()
                  );
                  return (
                    <tr key={`${field.name}-${index}`} className="align-top hover:bg-blue-50/30">
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {field.label}
                        {field.condition && <span className="mt-1 block text-[10px] font-normal text-amber-700">Shown for: {field.condition}</span>}
                      </td>
                      <td className="px-3 py-3">
                        <code className="rounded bg-slate-100 px-1.5 py-1 text-[10px] text-slate-700">{field.name}</code>
                        <span className="mt-1 block text-[10px] text-slate-500">{field.type} input</span>
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {field.options.length ? field.options.join(' · ') : field.unit || 'Not stated in form'}
                      </td>
                      <td className="px-3 py-3 leading-5 text-slate-700">
                        {describeInput(field, { parameters: matchingArticleParameter ? [matchingArticleParameter] : [] })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function HtmlParameterReference({ moduleId }) {
  const { modules, error, loading } = useModuleInputs(moduleId);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleModules = modules.map(module => ({
    ...module,
    fields: module.fields.filter(field =>
      !normalizedQuery ||
      `${field.label} ${field.name} ${field.unit} ${field.options.join(' ')} ${describeInput(field, module.article)}`.toLowerCase().includes(normalizedQuery)
    )
  })).filter(module => module.fields.length);

  return (
    <section className="my-8 space-y-5" aria-labelledby="html-parameter-reference">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="html-parameter-reference" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <BookOpenText className="h-5 w-5 text-blue-700" />
              {moduleId ? 'Inputs in this analysis form' : 'Analysis input guide'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This reference reads the control names, labels, units, choices, and conditional fields directly from the Nova analysis HTML forms. Use the drawing and project design basis when entering values; the descriptions explain the form fields and do not replace an engineering check.
            </p>
          </div>
          {moduleId && (
            <a
              href={`/${modules[0]?.file || ANALYSIS_MODULES.find(module => module.id === moduleId)?.file}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50"
            >
              Open source form <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {!moduleId && !loading && !error && modules.length > 1 && (
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Find a form field across all analysis modules"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
          Reading the analysis form fields…
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-5">
          {visibleModules.map(module => (
            <details key={module.id} open={!!moduleId} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-base font-semibold text-slate-900">
                  {module.title}
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{module.fields.length} input fields</span>
                </span>
                <span className="text-xs font-medium text-blue-700 group-open:hidden">Show inputs</span>
                <span className="hidden text-xs font-medium text-slate-500 group-open:inline">Hide inputs</span>
              </summary>
              <InputTable module={module} />
              <p className="mt-3 text-[11px] text-slate-500">
                Source: <a href={`/${module.file}`} target="_blank" rel="noreferrer" className="font-medium text-blue-700 underline underline-offset-2">public/{module.file}</a>. Conditional inputs may appear only for the selected form configuration.
              </p>
            </details>
          ))}
          {!visibleModules.length && (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No form inputs match “{query}”.</p>
          )}
        </div>
      )}
    </section>
  );
}
