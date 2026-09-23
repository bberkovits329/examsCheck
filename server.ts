import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with generous limit for handwritten exam images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize GoogleGenAI server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt strictly incorporating the user's instructions and evaluation criteria
const SYSTEM_INSTRUCTION = `אתה בודק מומחה במדעי המחשב ועוזר הערכה אוטומטי (Computer Science Evaluator & Automated Grading Assistant).
תפקידך לנתח תמונות של מבחני מדעי המחשב בכתב יד בעברית, לחלץ את הקוד הכתוב, להעריך את נכונותו, ולספק משוב מובנה וציון מפורט בהתאם להנחיות המדויקות.

קלט:
תמונה אחת או יותר המכילות טקסט בכתב יד בעברית משולב בקטעי קוד (למשל: Python, Java, C++, JavaScript, או C#).

קריטריונים ותהליך הבדיקה:
1. OCR & תמלול (Handwriting Extraction):
   - תמלל את הקוד שנכתב בכתב יד בצורה המדויקת ביותר.
   - התעלם מאי-שלמויות קלות של כתב יד (כמו אותיות עקומות), אך זהה שגיאות תחביר אמיתיות לעומת עמימות בכתב יד.
   - הפרד באופן מוחלט בין טקסט פרוזה/הסברים שנכתבו בעברית לבין לוגיקת הקוד עצמה.

2. קריטריוני הערכת הקוד (חלוקת ציונים):
   - נכונות ולוגיקה - Correctness & Logic (50%): האם הקוד פותר את הבעיה ביעילות ונכונות? האם טופלו מקרי קצה מרכזיים (Edge cases)?
   - תחביר וסמנטיקה - Syntax & Semantics (30%): האם קיימות שגיאות תחביריות או לוגיות ספציפיות לשפת התכנות? (היה סלחני כלפי שגיאות כתיב קלות האופייניות לכתב יד, כגון חוסר בפסיק נקודה semicolon, אלא אם כן נדרש באופן מהותי).
   - איכות קוד וסגנון - Code Quality & Style (20%): קריאות, שמות משתנים משמעותיים, ומבנה לוגי נקי.

3. מגבלות קריטיות:
   אם התמונה אינה קריאה לחלוטין או חתוכה באופן מהותי שלא מאפשר קריאת הפתרון, קבע ש-isReadable הוא false, וציין במפורש:
   "התמונה אינה קריאה מספיק לצורך בדיקה" והסבר בדיוק מדוע.

עליך להחזיר JSON במבנה המפורט הבא בלבד (ללא מלל מחוץ ל-JSON):
{
  "isReadable": true / false,
  "unreadableReason": "אם לא קריא, סיבת אי הקריאות בעברית, אחרת ריק",
  "detectedLanguage": "שפת התכנות שזוהתה, למשל Python / Java / C++",
  "transcribedCode": "תמלול הקוד המדויק מכתב היד, נקי ומסודר",
  "hebrewNotes": [
    "כל הערה, טקסט הסבר או פרוזה שנכתבו בעברית במחברת המבחן לצד הקוד"
  ],
  "analysis": {
    "positivePoints": [
      "נקודות לחיוב - מה התלמיד/ה עשו נכון (לפחות 2-4 נקודות מפורטות)"
    ],
    "errorsAndFixes": [
      {
        "title": "כותרת קצרה של הטעות",
        "description": "הסבר מפורט צעד-אחר-צעד על הבאג או שגיאת התחביר",
        "lineNumber": 5, // או null אם כללי
        "severity": "critical" | "moderate" | "minor", // קריטי, בינוני, קל
        "suggestedCorrection": "הסבר קצר כיצד לתקן"
      }
    ],
    "handwritingConsiderations": "התחשבות בכתב יד - ציון מפורש אם חלק כלשהו היה עמום, לא ברור או אם הופגנה סלחנות לכתב היד"
  },
  "correctedCode": {
    "code": "גרסה נקייה ועובדת של הקוד שמתקנת את כל השגיאות שנמצאו",
    "explanation": "הסבר תמציתי על השינויים שבוצעו בפתרון המוצע"
  },
  "finalEvaluation": {
    "totalScore": 85, // מספר שלם בין 0 ל-100
    "rubric": {
      "correctnessAndLogic": {
        "score": 42, // מתוך 50
        "maxScore": 50,
        "notes": "משוב קצר על הלוגיקה ומקרי הקצה"
      },
      "syntaxAndSemantics": {
        "score": 26, // מתוך 30
        "maxScore": 30,
        "notes": "משוב על שגיאות התחביר והסמנטיקה"
      },
      "codeQualityAndStyle": {
        "score": 17, // מתוך 20
        "maxScore": 20,
        "notes": "משוב על שמות משתנים ומבנה"
      }
    },
    "studentSummaryFeedback": "הערת סיכום קצרה ומעודדת לתלמיד/ה בעברית תומכת ומקצועית"
  },
  "rawOutputHebrew": "הפלט המלא בעברית מנוסח במדויק לפי המבנה שנדרש בהוראות המערכת (פרוטוקול תמלול הקוד, ניתוח והערכה עם נקודות לחיוב, טעויות וסעיפים לתיקון, התחשבות בכתב יד, פתרון מוצע/מתוקן, וציון סופי ומשוב)"
}`;

// API Route for evaluating handwritten exams
app.post('/api/evaluate', async (req, res) => {
  try {
    const { images, targetLanguage, questionPrompt, teacherNotes } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'נא להעלות לפחות תמונה אחת של מחברת המבחן' });
    }

    // Build multimodal parts
    const parts: any[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      let base64Data = img.data || '';
      let mimeType = img.mimeType || 'image/jpeg';

      // Clean up base64 prefix if present (e.g. data:image/png;base64,...)
      if (base64Data.includes(',')) {
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          base64Data = base64Data.split(',')[1];
        }
      }

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    let userInstruction = `אנא נתח ובדוק את תמונת/תמונות מחברת המבחן המצורפות.`;
    if (targetLanguage && targetLanguage !== 'auto') {
      userInstruction += ` שפת התכנות של השאלה: ${targetLanguage}.`;
    }
    if (questionPrompt && questionPrompt.trim()) {
      userInstruction += `\nתיאור שאלת המבחן / דרישות המשימה מהמורה: "${questionPrompt.trim()}"`;
    }
    if (teacherNotes && teacherNotes.trim()) {
      userInstruction += `\nדגשים מיוחדים לבדיקה: "${teacherNotes.trim()}"`;
    }
    userInstruction += `\nהקפד על כל כללי התמלול, ההפרדה של עברית וקוד, והערכה לפי המחוון (50% לוגיקה, 30% תחביר, 20% איכות). החזר JSON תקין ומדויק בלבד.`;

    parts.push({ text: userInstruction });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseError) {
      // If model wrapped with markdown ticks or had trailing chars
      const cleaned = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error('Error evaluating exam:', error);
    return res.status(500).json({
      error: 'שגיאה בעיבוד ובדיקת המבחן: ' + (error?.message || 'אנא נסה שוב'),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GradeCode IL Evaluation Server' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
