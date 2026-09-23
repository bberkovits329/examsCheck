export interface ExamSample {
  id: string;
  title: string;
  subtitle: string;
  language: string;
  category: string;
  questionPrompt: string;
  expectedScoreRange: string;
  difficulty: 'בסיסי' | 'בינוני' | 'מתקדם' | 'בדיקת קצה';
  description: string;
  svgContent: string;
}

// Generates an SVG exam paper with lined paper background, handwritten code, Hebrew notes, and marginalia
function createNotebookSvg(content: {
  examHeader: string;
  questionTitle: string;
  hebrewNotes: string[];
  codeLines: string[];
  crossoutLine?: number;
  isBlurry?: boolean;
}): string {
  const width = 850;
  const height = 1100;
  const marginX = 80;
  
  let linesSvg = '';
  // Ruled notebook lines (light blue with red left/right margin)
  for (let y = 140; y < height - 60; y += 30) {
    linesSvg += `<line x1="40" y1="${y}" x2="${width - 40}" y2="${y}" stroke="#cbd5e1" stroke-width="1.2" />`;
  }

  // Margin lines
  const leftMargin = `<line x1="${marginX}" y1="60" x2="${marginX}" y2="${height - 40}" stroke="#fca5a5" stroke-width="1.5" />`;
  const rightMargin = `<line x1="${width - marginX}" y1="60" x2="${width - marginX}" y2="${height - 40}" stroke="#fca5a5" stroke-width="1.5" />`;

  let notesSvg = '';
  let currentY = 165;

  // Hebrew notes
  content.hebrewNotes.forEach((note) => {
    notesSvg += `
      <text x="${width - marginX - 20}" y="${currentY}" font-family="'Courier New', 'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e293b" text-anchor="end" font-weight="600" direction="rtl">
        ${note}
      </text>
    `;
    currentY += 30;
  });

  currentY += 15;

  // Code lines
  let codeSvg = '';
  content.codeLines.forEach((line, idx) => {
    const isCrossed = content.crossoutLine === idx;
    const lineY = currentY;
    codeSvg += `
      <text x="${marginX + 30}" y="${lineY}" font-family="'Consolas', 'Courier New', monospace" font-size="17" fill="#0f172a" font-weight="600" letter-spacing="0.5">
        ${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    `;

    if (isCrossed) {
      codeSvg += `
        <line x1="${marginX + 20}" y1="${lineY - 4}" x2="${marginX + 320}" y2="${lineY - 6}" stroke="#ef4444" stroke-width="2.5" />
      `;
    }

    currentY += 30;
  });

  const filterDef = content.isBlurry
    ? `<filter id="blurFilter"><feGaussianBlur stdDeviation="7" /></filter>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #fafaf9;">
    <defs>
      ${filterDef}
      <pattern id="holes" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="180" r="14" fill="#e2e8f0" />
        <circle cx="20" cy="550" r="14" fill="#e2e8f0" />
        <circle cx="20" cy="920" r="14" fill="#e2e8f0" />
      </pattern>
    </defs>

    <g ${content.isBlurry ? 'filter="url(#blurFilter)"' : ''}>
      <!-- Sheet background with paper texture -->
      <rect width="${width}" height="${height}" fill="#fdfbf7" />
      <rect width="${width}" height="${height}" fill="url(#holes)" opacity="0.3" />

      <!-- Notebook rules -->
      ${linesSvg}
      ${leftMargin}
      ${rightMargin}

      <!-- Exam stamp & header -->
      <rect x="${width / 2 - 220}" y="40" width="440" height="50" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="4 4" />
      <text x="${width / 2}" y="70" font-family="'Arial', sans-serif" font-size="16" fill="#334155" text-anchor="middle" font-weight="bold">
        ${content.examHeader}
      </text>

      <text x="${width - marginX - 20}" y="125" font-family="'Arial', sans-serif" font-size="18" fill="#0f172a" text-anchor="end" font-weight="bold" direction="rtl">
        ${content.questionTitle}
      </text>

      <!-- Content -->
      ${notesSvg}
      ${codeSvg}

      <!-- Pen ink smudges & signature -->
      <path d="M 640 1020 Q 680 1000 720 1025 T 750 1010" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.7" />
      <text x="630" y="1040" font-family="cursive" font-size="14" fill="#475569">חתימת הנבחן/ת</text>
    </g>
  </svg>`;
}

export const SAMPLE_EXAMS: ExamSample[] = [
  {
    id: 'sample-python-binary-search',
    title: 'שאלה 2 (פייתון) - חיפוש בינארי רקורסיבי',
    subtitle: 'מבחן מתכונת בגרות במדעי המחשב - 5 יח״ל',
    language: 'Python',
    category: 'מבני נתונים ואלגוריתמים',
    difficulty: 'בינוני',
    expectedScoreRange: '82 - 88',
    questionPrompt: 'כתוב פונקציה רקורסיבית binary_search המקבלת רשימה ממוינת arr, ערך יעד target, ואינדקסים low ו-high. הפונקציה תחזיר את האינדקס של האיבר או 1- אם אינו קיים.',
    description: 'פתרון בכתב יד של תלמיד עם הערות בעברית. כולל חילוץ מקרה בסיס, אך יש טעות עדינה בהחזרת הערך (חסר return בקריאה הרקורסיבית העליונה).',
    svgContent: createNotebookSvg({
      examHeader: 'בחינת בגרות במדעי המחשב (שאלון 899381) - מחברת תשובות',
      questionTitle: 'שאלה 2: אלגוריתם חיפוש בינארי ברקורסיה',
      hebrewNotes: [
        '// בדיקת מקרה קצה: כאשר low עבר את high האיבר בוודאות לא נמצא',
        '// חישוב אמצע וחלוקה לשני חצאים (Divide & Conquer)',
        '// שים לב: המערך ממוין בסדר עולה לפי תנאי השאלה',
      ],
      codeLines: [
        'def binary_search(arr, target, low, high):',
        '    # Base case: not found',
        '    if low > high:',
        '        return -1',
        '',
        '    mid = (low + high) // 2',
        '',
        '    if arr[mid] == target:',
        '        return mid',
        '    elif arr[mid] > target:',
        '        # search left half',
        '        binary_search(arr, target, low, mid - 1)  # BUG: missing return!',
        '    else:',
        '        # search right half',
        '        return binary_search(arr, target, mid + 1, high)',
      ],
      crossoutLine: 10,
    }),
  },
  {
    id: 'sample-java-linked-list',
    title: 'שאלה 4 (ג׳אווה) - רשימה מקושרת ומציאת כפילויות',
    subtitle: 'מבחן אמצע סמסטר - מבני נתונים (Node<T>)',
    language: 'Java',
    category: 'רשימות מקושרות ועצמים',
    difficulty: 'בינוני',
    expectedScoreRange: '74 - 80',
    questionPrompt: 'כתוב פעולה חיצונית סטטית containsDuplicates המקבלת שרשרת חוליות מסוג Node<Integer> ומחזירה true אם קיים ערך המופיע לפחות פעמיים ברשימה, אחרת false.',
    description: 'פתרון בכתב יד בג׳אווה. התלמיד שכח לקדם את המצביע בלולאה הפנימית לפני בדיקת הסיום, מה שעלול לגרום ללולאה אינסופית בלוגיקה.',
    svgContent: createNotebookSvg({
      examHeader: 'המכללה האקדמית - מבני נתונים | מבחן מועד א׳',
      questionTitle: 'שאלה 4: בדיקת איברים כפולים בחוליות',
      hebrewNotes: [
        '// מעבר כפול על הרשימה לבדיקת כל זוג איברים',
        '// שימוש במצביע curr עבור האיבר הנוכחי ומצביע runner לבדיקת ההמשך',
        '// הנחה: הרשימה אינה מעגלית ומסתיימת ב-null',
      ],
      codeLines: [
        'public static boolean containsDuplicates(Node<Integer> head) {',
        '    if (head == null || !head.hasNext()) {',
        '        return false;',
        '    }',
        '    Node<Integer> curr = head;',
        '    while (curr != null) {',
        '        Node<Integer> runner = curr.getNext();',
        '        while (runner != null) {',
        '            if (curr.getValue().equals(runner.getValue())) {',
        '                return true;',
        '            }',
        '            runner = runner.getNext();',
        '        }',
        '        curr = curr.getNext();',
        '    }',
        '    return false;',
        '}',
      ],
    }),
  },
  {
    id: 'sample-cpp-pointers',
    title: 'שאלה 1 (C++) - ניהול זיכרון ומערך דינמי',
    subtitle: 'מבוא למדעי המחשב ותכנות מערכות',
    language: 'C++',
    category: 'מצביעים וניהול זיכרון',
    difficulty: 'מתקדם',
    expectedScoreRange: '90 - 95',
    questionPrompt: 'כתוב פונקציה C++ המקבלת מערך מספרים שלמים ומחזירה מערך דינמי חדש המכיל רק את המספרים החיוביים, יחד עם גודלו המעודכן.',
    description: 'קוד C++ ברמה גבוהה בכתב יד. לוגיקה תקינה לחלוטין, תחביר טוב, שימת לב ל-nullptr, עם הערה קלה על שמות משתנים.',
    svgContent: createNotebookSvg({
      examHeader: 'הפקולטה למדעי המחשב - מבוא למערכות מחשב',
      questionTitle: 'שאלה 1: סינון ערכים חיוביים והקצאה דינמית',
      hebrewNotes: [
        '// שלב 1: ספירת כמות המספרים החיוביים לקביעת גודל ההקצאה',
        '// שלב 2: הקצאת new int[count] והעתקת האיברים',
        '// עדכון פרמטר הגודל המוחזר דרך הפנייה (reference)',
      ],
      codeLines: [
        'int* filterPositive(const int* arr, int size, int& newSize) {',
        '    if (arr == nullptr || size <= 0) {',
        '        newSize = 0;',
        '        return nullptr;',
        '    }',
        '    int count = 0;',
        '    for (int i = 0; i < size; ++i) {',
        '        if (arr[i] > 0) count++;',
        '    }',
        '    if (count == 0) { newSize = 0; return nullptr; }',
        '    int* result = new int[count];',
        '    int idx = 0;',
        '    for (int i = 0; i < size; ++i) {',
        '        if (arr[i] > 0) {',
        '            result[idx++] = arr[i];',
        '        }',
        '    }',
        '    newSize = count;',
        '    return result;',
        '}',
      ],
    }),
  },
  {
    id: 'sample-blurry-unreadable',
    title: 'מקרה קצה: צילום מטושטש וחתוך (בדיקת מגבלה)',
    subtitle: 'הדגמת זיהוי תמונה שאינה קריאה מספיק לבדיקה',
    language: 'Python',
    category: 'בדיקת קצה ומגבלות',
    difficulty: 'בדיקת קצה',
    expectedScoreRange: 'ללא ציון (לא קריא)',
    questionPrompt: 'שאלה כללית בלולאות',
    description: 'צילום באיכות ירודה, עם טשטוש כבד וחיתוך של שולי הדף. המערכת מחויבת להחזיר: "התמונה אינה קריאה מספיק לצורך בדיקה".',
    svgContent: createNotebookSvg({
      examHeader: 'מחברת בחינה פגומה / צילום חשוך ומטושטש',
      questionTitle: 'שאלה 5: פונקציה מסובכת',
      hebrewNotes: [
        '// ...טקסט מטושטש ולא ניתן לפענוח...',
      ],
      codeLines: [
        'def process_data(???):',
        '   for x in ???????:',
        '      val = x ** 2 + ??????',
        '      # חתוך כאן בקצה הדף',
      ],
      isBlurry: true,
    }),
  },
];
