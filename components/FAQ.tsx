export type FAQItem = {
  q: string;
  a: string;
};

const defaultItems: FAQItem[] = [
  {
    q: "Mennyibe kerül a Freedom Air?",
    a: "A Freedom Air ára kb. 7 millió forint — ez csak picivel több, mint egy jó minőségű intraorális szkenner önmagában, viszont valódi fotogrammetriát is tudsz vele. Egy önálló fotogrammetriás rendszer (pl. iCam) 30–40 ezer EUR + külön IOS, vagyis sokszorosa az árnak.",
  },
  {
    q: "Miben más, mint a Shining 3D vagy más „fotogrammetriás” rendszerek?",
    a: "A piacon lévő legtöbb „fotogrammetriás” megoldás valójában scan body-ról scan body-ra fűzi össze a képeket — ez lényegében intraorális szkennelés markerekkel. Ha az implantátumok távol vannak egymástól, sok esetben nem tudja összefűzni. A Freedom Air ezzel szemben szájon kívülről, egyszerre látja az összes implantátumot — egyetlen képkockán, torzulás nélkül.",
  },
  {
    q: "Kell-e mellé külön intraorális szkenner?",
    a: "Nem. Ez a lényege: ugyanaz az eszköz végzi a fotogrammetriát ÉS a szájképletek (íny, fogak) szkennelését. Egy szoftver, egy felület, egy adatfolyam — nincs köztes konvertálás vagy emberi hibafaktor.",
  },
  {
    q: "Mit jelent az, hogy „ingyenes esetbemutató kihelyezéssel”?",
    a: "Előre egyeztetett időpontban kimegyünk a rendelődbe (Pesten vagy vidéken), és helyben beszkennelünk egy konkrét esetet a saját pácienseddel. Élőben látod, hogyan működik a Freedom Air a saját workflow-dban, mielőtt bármit eldöntenél.",
  },
  {
    q: "Mi a 2-napos szakmai oktatás, és hogyan kapom meg?",
    a: "Partnerünk, Dávid doktor egy kétnapos gyakorlati oktatást tart implantátumos körhidak kivitelezéséről és a fogművek elkészítéséről. Eredeti ára kb. 400 000 Ft. Ha nálunk veszed meg a Freedom Airt, ezt az oktatást ajándékba megkapod.",
  },
  {
    q: "Ki hív vissza, ha kitöltöm az űrlapot?",
    a: "A Meshdent két szakembere — Richárd vagy János — személyesen. Nem call center, nem szkripthez ragaszkodó értékesítő. Mindketten napi szinten dolgoznak ezzel a workflow-val, fogtechnikai háttérrel.",
  },
  {
    q: "Mi van, ha most analóg lenyomatvétellel dolgozom?",
    a: "Akkor a legtöbbet nyered: drasztikusan rövidebb székidő (lenyomat 30 perc → szkennelés percek), kevesebb páciensvizit, lenyomatonként 10–15 ezer Ft anyagköltség megspórolása. Az implantátumos pontosság pedig nem kérdés — egyenesen fotogrammetriás szinten dolgozol.",
  },
];

export default function FAQ({ items }: { items?: FAQItem[] } = {}) {
  const list = items ?? defaultItems;
  return (
    <div className="faq">
      {list.map((item) => (
        <details className="faq__item" key={item.q}>
          <summary>{item.q}</summary>
          <div className="faq__answer">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
