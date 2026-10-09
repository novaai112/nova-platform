import React from 'react';
import { BookOpenText, CheckCircle2, ChevronRight, Code2, ListChecks } from 'lucide-react';
import InteractiveChecklist from './InteractiveChecklist.jsx';

const MATH_SYMBOLS = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', theta: 'θ',
  lambda: 'λ', mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ',
  tau: 'τ', phi: 'φ', omega: 'ω', Delta: 'Δ', Sigma: 'Σ',
  cdot: '·', times: '×', le: '≤', leq: '≤', ge: '≥', geq: '≥',
  approx: '≈', neq: '≠', pm: '±', infinity: '∞', degree: '°',
  to: '→', rightarrow: '→', and: '∧', or: '∨'
};

function MathExpression({ expression }) {
  let index = 0;
  let key = 0;

  const parseGroup = () => {
    if (expression[index] === '{') {
      index += 1;
      const content = parseSequence(true);
      if (expression[index] === '}') index += 1;
      return content;
    }
    return parseAtom();
  };

  const parseCommand = () => {
    index += 1;
    if (index >= expression.length) return '\\';
    if (!/[a-zA-Z]/.test(expression[index])) {
      const escaped = expression[index];
      index += 1;
      return escaped;
    }

    const start = index;
    while (/[a-zA-Z]/.test(expression[index] || '')) index += 1;
    const command = expression.slice(start, index);

    if (['text', 'mathrm', 'mathbf', 'mathit', 'operatorname'].includes(command)) {
      const content = parseGroup();
      return <span className={command === 'text' ? 'not-italic' : 'italic'}>{content}</span>;
    }
    if (command === 'frac') {
      const numerator = parseGroup();
      const denominator = parseGroup();
      return (
        <span className="inline-grid align-middle text-center text-[0.82em] leading-tight">
          <span className="border-b border-current px-0.5 pb-0.5">{numerator}</span>
          <span className="px-0.5 pt-0.5">{denominator}</span>
        </span>
      );
    }
    if (command === 'sqrt') {
      return <span className="inline-flex items-start"><span aria-hidden="true">√</span><span className="border-t border-current px-0.5">{parseGroup()}</span></span>;
    }
    if (['left', 'right', 'displaystyle', 'limits'].includes(command)) return null;
    if (command === 'quad') return <span className="inline-block w-4" />;
    if (command === 'qquad') return <span className="inline-block w-8" />;
    if ([',', ';', '!', ' '].includes(command)) return ' ';
    if (MATH_SYMBOLS[command]) return MATH_SYMBOLS[command];
    return command;
  };

  const parseAtom = () => {
    const char = expression[index];
    if (char === '\\') return parseCommand();
    if (char === '{') return parseGroup();
    index += 1;
    return char;
  };

  const parseSequence = (stopAtBrace = false) => {
    const nodes = [];
    while (index < expression.length && !(stopAtBrace && expression[index] === '}')) {
      const marker = expression[index];
      if (marker === '_' || marker === '^') {
        index += 1;
        const script = parseGroup();
        const base = nodes.pop() ?? '';
        nodes.push(
          <span className="inline-flex items-baseline" key={`script-${key++}`}>
            {base}{marker === '_' ? <sub className="text-[0.72em] leading-none">{script}</sub> : <sup className="text-[0.72em] leading-none">{script}</sup>}
          </span>
        );
      } else {
        const atom = parseAtom();
        if (atom !== null && atom !== '') nodes.push(atom);
      }
    }
    return nodes.map((node, nodeIndex) => React.isValidElement(node)
      ? React.cloneElement(node, { key: node.key ?? `math-${key++}` })
      : <React.Fragment key={`math-${key++}-${nodeIndex}`}>{node}</React.Fragment>);
  };

  return <>{parseSequence()}</>;
}

function renderInline(text, keyPrefix) {
  return text.split(/(\$\$[\s\S]+?\$\$|\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$|\*[^*]+\*)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <code key={key} className="font-mono text-[0.95em] text-blue-900">{part.slice(2, -2).trim()}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{renderInline(part.slice(2, -2), `${key}-bold`)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{renderInline(part.slice(1, -1), `${key}-italic`)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-slate-800">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <span key={key} className="whitespace-nowrap font-serif italic text-slate-900" role="math">
        <MathExpression expression={part.slice(1, -1)} />
      </span>;
    }
    return part;
  });
}

export function ArticleText({ text }) {
  if (!text) return null;

  const lines = text.trim().split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (/^#{1,4}\s+/.test(line)) {
      blocks.push({ type: 'heading', content: line.replace(/^#{1,4}\s+/, '') });
      index += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(lines[index].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
        index += 1;
      }
      blocks.push({ type: 'table', rows: rows.filter(cells => !cells.every(cell => /^:?-{3,}:?$/.test(cell))) });
      continue;
    }

    if (line.startsWith('$$')) {
      const equation = [line.replace(/^\$\$|\$\$\s*$/g, '')];
      const completeOnStart = line.slice(2).includes('$$');
      index += 1;
      if (!completeOnStart) {
        while (index < lines.length) {
          const equationLine = lines[index].trim();
          equation.push(equationLine.replace(/\$\$/g, ''));
          index += 1;
          if (equationLine.includes('$$')) break;
        }
      }
      blocks.push({ type: 'equation', content: equation.join(' ').trim() });
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items = [];
      const pattern = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (index < lines.length && pattern.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(pattern, ''));
        index += 1;
      }
      blocks.push({ type: ordered ? 'ordered-list' : 'list', items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const nextLine = lines[index].trim();
      if (
        !nextLine ||
        /^#{1,4}\s+/.test(nextLine) ||
        nextLine.startsWith('|') ||
        nextLine.startsWith('$$') ||
        /^[-*]\s+/.test(nextLine) ||
        /^\d+\.\s+/.test(nextLine)
      ) break;
      paragraph.push(nextLine);
      index += 1;
    }
    blocks.push({ type: 'paragraph', content: paragraph.join(' ') });
  }

  return (
    <div className="space-y-3 text-sm leading-7 text-slate-700">
      {blocks.map((block, blockIndex) => {
        if (block.type === 'list' || block.type === 'ordered-list') {
          const List = block.type === 'ordered-list' ? 'ol' : 'ul';
          return (
            <List key={blockIndex} className={`${block.type === 'ordered-list' ? 'list-decimal' : 'list-disc'} space-y-1.5 pl-5`}>
              {block.items.map((item, lineIndex) => (
                <li key={lineIndex}>{renderInline(item, `${blockIndex}-${lineIndex}`)}</li>
              ))}
            </List>
          );
        }

        if (block.type === 'heading') {
          return (
            <h3 key={blockIndex} className="pt-2 text-base font-semibold text-slate-900">
              {block.content}
            </h3>
          );
        }

        if (block.type === 'table') {
          const [headers, ...bodyRows] = block.rows;
          if (!headers) return null;
          return (
            <div key={blockIndex} className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[30rem] border-collapse text-left text-xs">
                <thead className="bg-slate-50 text-slate-800">
                  <tr>{headers.map((cell, index) => <th key={index} className="border-b border-slate-200 px-3 py-2.5 font-semibold">{renderInline(cell.replace(/\*\*/g, ''), `table-head-${index}`)}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2.5 align-top text-slate-700">{renderInline(cell.replace(/\*\*/g, ''), `table-${rowIndex}-${cellIndex}`)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'equation') {
          return (
            <div key={blockIndex} className="overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-4 text-base leading-8 text-blue-950 sm:px-6 sm:text-lg">
              <div className="min-w-max font-serif" role="math">
                <MathExpression expression={block.content} />
              </div>
            </div>
          );
        }

        return <p key={blockIndex}>{renderInline(block.content, `block-${blockIndex}`)}</p>;
      })}
    </div>
  );
}

function StepList({ title, steps }) {
  if (!steps?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
        <ListChecks className="h-5 w-5 text-blue-700" />
        {title}
      </h2>
      <ol className="space-y-2.5">
        {steps.map((step, index) => {
          const label = typeof step === 'string' ? step : step.title || step.name || step.status || `Step ${index + 1}`;
          const description = typeof step === 'string' ? null : step.desc || step.description || step.action;
          return (
            <li key={index} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-800">
                {typeof step === 'object' && step.step ? step.step : index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
                {description && <div className="mt-1"><ArticleText text={description} /></div>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FeatureCards({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const name = item.name || item.title || item.status || `Item ${index + 1}`;
          return (
            <article key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
              {item.filename && <code className="mt-1 block text-xs text-blue-800">{item.filename}</code>}
              {(item.desc || item.description) && <div className="mt-2"><ArticleText text={item.desc || item.description} /></div>}
              {item.features?.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  {item.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DataTable({ title, rows }) {
  if (!rows?.length) return null;
  const columns = Object.keys(rows[0]);

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>{columns.map(column => <th key={column} className="border-b border-slate-200 px-4 py-3 font-semibold">{column.replace(/([A-Z])/g, ' $1')}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="align-top">
                {columns.map(column => (
                  <td key={column} className="px-4 py-3 text-slate-700">
                    {Array.isArray(row[column]) ? row[column].join(', ') : String(row[column] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Example({ example, articleTitle }) {
  if (!example) return null;

  const entries = [
    ['Problem', example.problem || example.problemStatement],
    ['Given data', example.inputs || example.givenData],
    ['Calculation steps', example.calculationSteps],
    ['Result', example.result || example.conclusion],
    ['Interpretation', example.interpretation]
  ].filter(([, value]) => value);

  if (!entries.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
        <Code2 className="h-5 w-5 text-indigo-700" />
        Worked example
      </h2>
      <div className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800">{articleTitle.replace(/:\s*.*$/, '')} · illustrative example</p>
        {entries.map(([label, value]) => (
          <div key={label}>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</h3>
            {Array.isArray(value) ? <StepList title={label} steps={value} /> : <ArticleText text={String(value)} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ArticleDeepContent({ article }) {
  const technicalDetail = article.technicalDepth?.engineer || article.depthContent?.engineer;
  const structuredSteps = article.stepByStepProcedure || article.tenStepWorkflow || article.aiWorkflow || article.installationProcedure;
  const cards = article.keyFeatures || article.keyScreens || article.wizardsCatalog;
  const checklist = article.checklist || article.verificationChecklist;
  const example = article.example || article.workedExample;
  const explanatorySections = [
    ['engineeringTheory', 'Engineering principles'],
    ['calculationLogic', 'Calculation method'],
    ['resultInterpretation', 'Interpreting results'],
    ['engineeringLimitations', 'Scope and limitations'],
    ['engineeringCaution', 'Engineering review and responsibility']
  ].filter(([key]) => article[key]);

  return (
    <div className="my-10 space-y-9">
      {technicalDetail && (
        <details open className="group rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-blue-950">
            <span className="flex items-center gap-2"><BookOpenText className="h-4 w-4" /> Engineering detail</span>
            <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-4 border-t border-blue-200 pt-4">
            <ArticleText text={technicalDetail} />
          </div>
        </details>
      )}

      {explanatorySections.map(([key, title]) => (
        <section key={key} className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <ArticleText text={article[key]} />
        </section>
      ))}

      {article.supportedConfigurations?.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Supported configurations</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {article.supportedConfigurations.map(item => (
              <li key={item} className="flex gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <StepList
        title={article.tenStepWorkflow ? 'End-to-end engineering workflow' : article.aiWorkflow ? 'CAD generation workflow' : article.installationProcedure ? 'Installation procedure' : 'Step-by-step engineering procedure'}
        steps={structuredSteps}
      />
      <FeatureCards
        title={article.keyFeatures ? 'Platform capabilities' : article.wizardsCatalog ? 'Available automation tools' : 'Key screens'}
        items={cards}
      />
      <DataTable title="Job lifecycle" rows={article.lifecycleStates} />
      <DataTable title="Unit-system reference" rows={article.consistencyMatrix} />
      <DataTable title="Keyboard shortcuts" rows={article.shortcutsTable} />
      <Example example={example} articleTitle={article.title} />

      {checklist?.length > 0 && (
        <InteractiveChecklist
          checklistId={article.id}
          title={`${article.title.replace(/:\s*.*$/, '')} verification checklist`}
          items={checklist.map(item => typeof item === 'string' ? item : item.text || item.label)}
        />
      )}
    </div>
  );
}
