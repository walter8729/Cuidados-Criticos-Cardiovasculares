export interface ModuleMeta {
  id: string;
  roman: string;
  shortTitle: string;
  fullTitle: string;
  part: 1 | 2;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  searchKeywords: string;
}

export const MODULES_META: ModuleMeta[] = [
  {
    id: 'm1',
    roman: 'I',
    shortTitle: 'ECG y sistemática',
    fullTitle: 'Módulo I: Electrocardiograma Normal, Semiología y Sistemática de Lectura en UCI',
    part: 1,
    accentText: 'text-teal-700 dark:text-teal-300',
    accentBorder: 'border-teal-600/30 dark:border-teal-400/30',
    accentBg: 'bg-teal-50/70 dark:bg-teal-950/40',
    searchKeywords:
      'ecg electrocardiograma vectores calibracion 25 mm/s 10 mm/mv derivaciones v1 v2 v3 v4 v5 v6 v4r v7 v8 v9 algoritmo 5 pasos frecuencia cardiaca metodo 300 6 segundos ritmo eje electrico pr qrs qtc bazett punto j st onda t torsades de pointes temblor somatico hiperpotasemia tienda de campana',
  },
  {
    id: 'm2',
    roman: 'II',
    shortTitle: 'Hipertensión y crisis',
    fullTitle: 'Módulo II: Hipertensión Arterial en Cuidados Críticos: Crisis, Monitorización y Farmacología',
    part: 1,
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-600/30 dark:border-amber-400/30',
    accentBg: 'bg-amber-50/70 dark:bg-amber-950/40',
    searchKeywords:
      'hipertension arterial oms hearts linea arterial pai pam presion arterial media eje flebostatico onda cuadrada subamortiguamiento sobreamortiguamiento test de allen urgencia emergencia hipertensiva 180/120 sindrome aortico agudo labetalol nitroglicerina libre pvc nitroprusiato fotoproteccion cianuro acv alteplasa rt-pa nihss nifedipino sublingual',
  },
  {
    id: 'm3',
    roman: 'III',
    shortTitle: 'Insuficiencia cardíaca',
    fullTitle: 'Módulo III · Insuficiencia cardíaca y shock cardiogénico',
    part: 1,
    accentText: 'text-violet-700 dark:text-violet-300',
    accentBorder: 'border-violet-600/30 dark:border-violet-400/30',
    accentBg: 'bg-violet-50/70 dark:bg-violet-950/40',
    searchKeywords:
      'insuficiencia cardiaca shock cardiogenico nt-probnp 300 450 900 1800 pocus vci matriz stevenson caliente seco humedo frio perfil a b l c edema agudo de pulmon cpap vmni furosemida ototoxicidad scai lactato diuresis noradrenalina sg5 dobutamina levosimendan or-1896 balance positivo iam anterior',
  },
  {
    id: 'm4',
    roman: 'IV',
    shortTitle: 'Coronario agudo',
    fullTitle: 'Módulo IV · Síndrome coronario agudo',
    part: 1,
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBorder: 'border-rose-600/30 dark:border-rose-400/30',
    accentBg: 'bg-rose-50/70 dark:bg-rose-950/40',
    searchKeywords:
      'sindrome coronario agudo scacest iamsest angina inestable troponina bcri dolor tipico signo de levine equivalentes anginosos algoritmo reperfusion icp primaria puerta balon 60 120 fibrinolisis puerta aguja 10 rescate aas ticagrelor prasugrel clopidogrel heparina infarto ventriculo derecho coronaria derecha v3r v4r precarga cristaloides',
  },
  {
    id: 'm5',
    roman: 'V',
    shortTitle: 'SCA y cirugía CV',
    fullTitle: 'Módulo V · SCA, intervencionismo estructural y cirugía cardiovascular',
    part: 2,
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-600/30 dark:border-blue-400/30',
    accentBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    searchKeywords:
      'tema 20 21 22 scacest scasest complicaciones mecanicas rotura pared libre septal civ insuficiencia mitral musculo papilar intervencionismo estructural tavi mitraclip coi cia hemorragia pseudoaneurisma fistula arteriovenosa contraste encefalopatia leak paravalvular cirugia cardiovascular cec drenajes coagulopatia protamina tranexamico taponamiento postquirurgico reesternotomia hematoma retroperitoneal',
  },
  {
    id: 'm6',
    roman: 'VI',
    shortTitle: 'Aorta y taponamiento',
    fullTitle: 'Módulo VI · Síndrome aórtico agudo y taponamiento cardíaco',
    part: 2,
    accentText: 'text-pink-700 dark:text-pink-300',
    accentBorder: 'border-pink-600/30 dark:border-pink-400/30',
    accentBg: 'bg-pink-50/70 dark:bg-pink-950/40',
    searchKeywords:
      'tema 23 24 sindrome aortico agudo saa diseccion aortica 80 hematoma intramural 15 ulcera penetrante 5 stanford a ascendente abierto stanford b descendente baja betabloqueante tevar anti-impulso dp/dt esmolol labetalol taponamiento cardiaco shock obstructivo triada de beck pulso paradojico 10 mmhg pericardiocentesis',
  },
  {
    id: 'm7',
    roman: 'VII',
    shortTitle: 'Arritmias y marcapasos',
    fullTitle: 'Módulo VII · Arritmias, soporte eléctrico y electrofisiología',
    part: 2,
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-600/30 dark:border-emerald-400/30',
    accentBg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
    searchKeywords:
      'tema 25 26 27 28 29 taquiarritmias qrs estrecho ancho fa flutter wpw tv fv banderas rojas cardioversion sincronizada desfibrilacion bifasico joules r sobre t bradiarritmias bloqueo av primer grado mobitz wenckebach 2:1 tercer grado completo atropina adrenalina dopamina isoproterenol marcapasos temporal transcutaneo mtc transvenoso mtt umbral captura ablacion electrofisiologia fistula auriculo-esofagica espiculas',
  },
  {
    id: 'm8',
    roman: 'VIII',
    shortTitle: 'IC aguda y shock',
    fullTitle: 'Módulo VIII · Insuficiencia cardíaca aguda y shock cardiogénico',
    part: 2,
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBorder: 'border-orange-600/30 dark:border-orange-400/30',
    accentBg: 'bg-orange-50/70 dark:bg-orange-950/40',
    searchKeywords:
      'tema 30 insuficiencia cardiaca aguda shock cardiogenico sns sraa bnp nt-probnp edema agudo de pulmon eap ortopnea crepitantes esputo rosado inotropicos dobutamina noradrenalina levosimendan vasodilatadores nitroglicerina nitroprusiato tam 70 bcpia impella ecmo fowler cpap bipap furosemida acidemia hipoxemia vni',
  },
];
