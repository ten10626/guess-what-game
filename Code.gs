const SPREADSHEET_ID = '1y9xBAmObTO_EKpvrpzK_2vJR_iKxp7K8ODqP8Kr-Jf4';
const SHEET_NAME = '投稿';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    const type = data.type || '';
    const word = String(data.word || '').trim();
    const category = String(data.category || '').trim();
    const difficulty = String(data.difficulty || '').trim();
    const reason = String(data.reason || '').trim();
    const memo = String(data.memo || '').trim();
    const userAgent = String(data.userAgent || '').trim();

    if (!['add', 'delete'].includes(type)) {
      return jsonResponse({ ok: false, error: 'invalid_type' });
    }

    if (!word) {
      return jsonResponse({ ok: false, error: 'word_required' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'timestamp',
        'type',
        'word',
        'category',
        'difficulty',
        'reason',
        'memo',
        'userAgent'
      ]);
    }

    sheet.appendRow([
      new Date(),
      type,
      word,
      category,
      difficulty,
      reason,
      memo,
      userAgent
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
