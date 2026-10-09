import React, { useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';

const PHOTO_LIBRARY = {
  nozzle: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/LPT._EBOR_reactor_vessel_in_TAN_646._Pressure_vessel_head_being_installed_in_vault._Refueling_port_extension_%28right%29_and_control_rod_nozzles_%28center%29._Camera_facing_northwest._HAER_ID-33-E-285.tif/lossy-page1-1280px-thumbnail.tif.jpg',
    alt: 'Historic photograph of a pressure-vessel head being installed, with reactor nozzles visible',
    caption: 'Pressure-vessel head and nozzle installation',
    creator: 'Historic American Engineering Record collection',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:LPT._EBOR_reactor_vessel_in_TAN_646._Pressure_vessel_head_being_installed_in_vault._Refueling_port_extension_(right)_and_control_rod_nozzles_(center)._Camera_facing_northwest._HAER_ID-33-E-285.tif',
    license: 'Public domain'
  },
  bellows: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Metal_expansion_joint_on_fiberglass_piping.jpg',
    alt: 'Metal expansion joint installed on fiberglass piping',
    caption: 'Metal expansion joint on piping',
    creator: 'RomanM82',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Metal_expansion_joint_on_fiberglass_piping.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
  },
  flange: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rusty_Bolts_on_Pipe_Flange.jpg?width=1280',
    alt: 'Close-up photograph of bolted pipe flange joint',
    caption: 'Bolted pipe flange joint',
    creator: 'See Commons file page',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Rusty_Bolts_on_Pipe_Flange.jpg',
    license: 'See Commons file page'
  },
  pwht: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Castings_fresh_from_the_heat_treatment_furnace.jpg/1280px-Castings_fresh_from_the_heat_treatment_furnace.jpg',
    alt: 'Steel castings just removed from a heat-treatment furnace',
    caption: 'Steel castings after furnace heat treatment',
    creator: 'Goodwin Steel Castings',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Castings_fresh_from_the_heat_treatment_furnace.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/'
  },
  saddle: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pressure_tanks_under_construction.jpg/1280px-Pressure_tanks_under_construction.jpg',
    alt: 'Horizontal pressure tanks during industrial fabrication',
    caption: 'Horizontal pressure tanks during fabrication',
    creator: 'W.carter',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Pressure_tanks_under_construction.jpg',
    license: 'CC0'
  },
  hotBox: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Shell_heat_exchanger_LS.JPG',
    alt: 'Industrial shell heat exchanger',
    caption: 'Shell heat exchanger',
    creator: 'Armchoir',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Shell_heat_exchanger_LS.JPG',
    license: 'Public domain'
  },
  stiffener: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Double_bottoms_of_the_first_SD14_%2815944603685%29.jpg',
    alt: 'Exposed heavy steel framing during ship construction',
    caption: 'Heavy steel framing during vessel construction',
    creator: 'Tyne & Wear Archives & Museums',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Double_bottoms_of_the_first_SD14_(15944603685).jpg',
    license: 'No restrictions stated',
    licenseUrl: 'https://www.flickr.com/commons/usage/'
  },
  tubesheet: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Tube_bundle_of_a_shell_%26_tube_heat_exchanger_%28before_assembly%29.jpg',
    alt: 'Tube bundle for a shell-and-tube heat exchanger before assembly',
    caption: 'Heat-exchanger tube bundle before assembly',
    creator: 'Harald the Bard',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Tube_bundle_of_a_shell_%26_tube_heat_exchanger_(before_assembly).jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
  },
  lug: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manh%C3%A8s-David_vertical_converters_hall_at_the_Anaconda_Copper.png?width=1280',
    alt: 'Industrial converter lifted and handled by overhead cranes',
    caption: 'Industrial heavy-equipment lifting operation',
    creator: 'See Commons file page',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Manh%C3%A8s-David_vertical_converters_hall_at_the_Anaconda_Copper.png',
    license: 'See Commons file page'
  },
  trunnion: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pressure_vessel_and_gauge_displayed_at_an_industrial_expo.jpg?width=1280',
    alt: 'Pressure vessel and gauge displayed at an industrial exhibition',
    caption: 'Pressure vessel with instrumentation',
    creator: 'See Commons file page',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Pressure_vessel_and_gauge_displayed_at_an_industrial_expo.jpg',
    license: 'See Commons file page'
  },
  tensile: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Proba_rozciagania_stal_probka_2.jpg/1280px-Proba_rozciagania_stal_probka_2.jpg',
    alt: 'Steel tensile-test specimen after testing',
    caption: 'Steel specimen after a tensile test',
    creator: 'Andrzej Otrębski',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Proba_rozciagania_stal_probka_2.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
  }
};

const ARTICLE_PHOTOS = {
  'nozzle-analysis': 'nozzle',
  'bellows-analysis': 'bellows',
  'flange-analysis': 'flange',
  'local-pwht': 'pwht',
  'saddle-analysis': 'saddle',
  'hot-box-analysis': 'hotBox',
  'stiffener-analysis': 'stiffener',
  'tubesheet-analysis': 'tubesheet',
  'lug-analysis': 'lug',
  'trunnion-analysis': 'trunnion',
  'asme-materials': 'tensile'
};

export default function ArticlePhoto({ articleId }) {
  const [failed, setFailed] = useState(false);
  const photoKey = ARTICLE_PHOTOS[articleId];
  if (!photoKey) return null;
  const photo = PHOTO_LIBRARY[photoKey];

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {failed ? (
        <div className="flex min-h-40 items-center justify-center gap-2 bg-slate-50 px-5 text-sm text-slate-500">
          <Camera className="h-4 w-4" />
          <span>Photo unavailable. Open the source file to view it.</span>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="h-48 w-full bg-slate-100 object-cover sm:h-64"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-xs text-slate-600">
        <span>{photo.caption} — illustrative reference, not a Nova analysis result.</span>
        <span className="inline-flex items-center gap-1.5">
          Credit: {photo.creator}
          <span aria-hidden="true">·</span>
          <a
            href={photo.licenseUrl || photo.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
          >
            {photo.license}
          </a>
          <a
            href={photo.fileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open image source on Wikimedia Commons"
            className="text-slate-500 hover:text-blue-700"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
