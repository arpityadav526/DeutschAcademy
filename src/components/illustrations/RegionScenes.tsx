import React from "react";

export type RegionKey =
  | "hamburg"
  | "koeln"
  | "schwarzwald"
  | "berlin"
  | "alpen";

const regionNames: Record<RegionKey, string> = {
  hamburg: "Hamburg und die Nordsee",
  koeln: "Köln am Rhein",
  schwarzwald: "Der Schwarzwald",
  berlin: "Berlin",
  alpen: "Die Alpen und die Zugspitze",
};

export function RegionScene({
  region,
  className = "",
}: {
  region: RegionKey;
  className?: string;
}) {
  const label = regionNames[region];
  return (
    <svg
      className={className}
      viewBox="0 0 900 340"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <rect width="900" height="340" fill="var(--region-sky)" />
      <circle cx="760" cy="72" r="38" fill="var(--region-sun)" />
      {region === "hamburg" && (
        <>
          <path d="M0 205h900v135H0z" fill="var(--region-water)" />
          <path
            d="M0 218h900M0 247h900M0 292h900"
            stroke="var(--region-water-line)"
            strokeWidth="5"
          />
          <path
            d="M78 205V92h139v113M91 118h113M91 153h113M91 185h113"
            fill="var(--region-brick)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M109 93V40m0 0 56 48M167 88V31m0 0 41 48"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="7"
          />
          <path
            d="M320 204V132l95-62 96 62v72"
            fill="var(--region-glass)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M331 136l84-54 83 54"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M354 150h12m18 0h12m18 0h12m18 0h12m-94 25h12m18 0h12m18 0h12m18 0h12"
            stroke="var(--paper)"
            strokeWidth="5"
          />
          <path
            d="M585 207l41-64 41 64z"
            fill="var(--region-sand)"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M626 146v-53m0 0 66 111h-66"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M694 103q20-22 39 0m-29-12q12-14 24 0"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="4"
          />
        </>
      )}
      {region === "koeln" && (
        <>
          <path
            d="M0 228q120-20 245 0t250 0 250 0 155 0v112H0z"
            fill="var(--region-water)"
          />
          <path
            d="M0 248q120-20 245 0t250 0 250 0 155 0"
            fill="none"
            stroke="var(--region-water-line)"
            strokeWidth="5"
          />
          <path
            d="M300 221V97l35-61 35 61v124m38 0V87l41-72 41 72v134"
            fill="var(--region-stone)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M323 97h24m68-10h34m-107 52h34m48-17h48m-115 60h35m47-18h48"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M560 222q42-81 88 0m24 0q42-81 88 0"
            fill="none"
            stroke="var(--region-vine)"
            strokeWidth="8"
          />
          <path d="M0 190h900" stroke="var(--region-vine)" strokeWidth="6" />
          <path
            d="M130 236l38-39 40 39z"
            fill="var(--region-wine)"
            stroke="var(--ink)"
            strokeWidth="4"
          />
          <path
            d="M168 197v-42m0 0 22 41"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="4"
          />
        </>
      )}
      {region === "schwarzwald" && (
        <>
          <path
            d="M0 237q135-120 275 0t280 0 345-8v111H0z"
            fill="var(--region-hill)"
          />
          <path
            d="M0 272q120-85 245 0t300 0 355-12v80H0z"
            fill="var(--region-forest)"
          />
          {[70, 150, 235, 590, 690, 790, 850].map((x, i) => (
            <path
              key={x}
              d={`M${x} 252l${-30 + (i % 3) * 4} -74h22l-14 -39 22 -46 22 46 -13 39h22l-30 74z`}
              fill="var(--region-fir)"
              stroke="var(--ink)"
              strokeWidth="3"
            />
          ))}
          <path
            d="M360 214V158l58-51 62 51v56z"
            fill="var(--region-timber)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M348 160l70-62 74 62M384 127v87m68-83v83m-68-46h68m-68 31h68"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="7"
          />
          <circle
            cx="418"
            cy="179"
            r="16"
            fill="var(--region-clock)"
            stroke="var(--ink)"
            strokeWidth="4"
          />
          <path
            d="M418 167v13l10 5"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <path
            d="M544 215V146l72-53 73 53v69"
            fill="var(--region-timber)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M532 148l84-63 85 63m-129 0v67m87-67v67m-87-34h87"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="6"
          />
        </>
      )}
      {region === "berlin" && (
        <>
          <rect y="236" width="900" height="104" fill="var(--region-ground)" />
          <path
            d="M136 236V125h18V84h24v41h18v111M347 236V145h32v-26h28v26h32v91"
            fill="var(--region-concrete)"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M146 124h92l-12 12h-68zM153 144h13v15h-13zm29 0h13v15h-13zm29 0h13v15h-13z"
            fill="var(--region-gold)"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <path
            d="M505 236V134h195v102"
            fill="var(--region-stone)"
            stroke="var(--ink)"
            strokeWidth="6"
          />
          <path
            d="M495 134h215l-15-20H510zM535 136v100m44-100v100m44-100v100m44-100v100"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="8"
          />
          <path
            d="M0 270h900M0 293h900"
            stroke="var(--region-yellow)"
            strokeWidth="8"
          />
          <path
            d="M240 247h116v37H240z"
            fill="var(--region-red)"
            stroke="var(--ink)"
            strokeWidth="4"
          />
          <circle cx="265" cy="288" r="12" fill="var(--ink)" />
          <circle cx="330" cy="288" r="12" fill="var(--ink)" />
          <path d="M270 252h35v27h-35zm43 0h35v27h-35z" fill="var(--paper)" />
        </>
      )}
      {region === "alpen" && (
        <>
          <path
            d="M0 262L159 121l67 73 156-151 103 121 96-92 184 190v78H0z"
            fill="var(--region-mountain-back)"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path
            d="M250 204L382 43l76 96-52-26-25 33-28-15zM513 169l67-97 90 104-51-36-24 23-24-18z"
            fill="var(--region-snow)"
            stroke="var(--ink)"
            strokeWidth="4"
          />
          <path
            d="M0 275q176-47 349 0t551 0v65H0z"
            fill="var(--region-mountain-front)"
          />
          <path
            d="M375 189V72m0 12l-35 36m35-36 36 36"
            stroke="var(--region-cross)"
            strokeWidth="8"
          />
          <path
            d="M90 230l560 45"
            stroke="var(--region-cable)"
            strokeWidth="5"
          />
          <path
            d="M484 255v-51h76v51m-90-51h104"
            fill="var(--region-cable-car)"
            stroke="var(--ink)"
            strokeWidth="5"
          />
          <path d="M495 219h54" stroke="var(--paper)" strokeWidth="4" />
          <path
            d="M700 255V180m-12 0h24m-12-12v12"
            stroke="var(--region-cross)"
            strokeWidth="5"
          />
        </>
      )}
      <path d="M0 324h900" stroke="var(--ink)" strokeWidth="8" />
      <path d="M28 320h92m35 0h92m35 0h92m35 0h92m35 0h92m35 0h92m35 0h92" stroke="var(--paper)" strokeWidth="3" strokeDasharray="15 8" />
      <path d="M210 274h112q13 0 13 13v10H210z" fill="var(--ubahn)" stroke="var(--ink)" strokeWidth="4" />
      <path d="M224 279h29v10h-29zm37 0h29v10h-29z" fill="var(--gletscherblau)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="238" cy="300" r="7" fill="var(--ink)"/><circle cx="307" cy="300" r="7" fill="var(--ink)"/>
    </svg>
  );
}

export function JourneyPanorama({ className = "" }: { className?: string }) {
  const scenes: RegionKey[] = [
    "hamburg",
    "koeln",
    "schwarzwald",
    "berlin",
    "alpen",
  ];
  return (
    <div
      className={`journey-panorama ${className}`}
      aria-label="Reiseroute von der Nordsee zur Zugspitze"
    >
      {scenes.map((region) => (
        <RegionScene key={region} region={region} className="journey-scene" />
      ))}
      <div className="journey-train" aria-hidden="true">
        ◆══●══●
      </div>
      <div className="journey-labels" aria-hidden="true">
        <span>Nordsee</span>
        <span>Rhein</span>
        <span>Schwarzwald</span>
        <span>Berlin</span>
        <span>Zugspitze</span>
      </div>
    </div>
  );
}
