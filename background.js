chrome.action.onClicked.addListener(async () => {
  const items = await chrome.readingList.query({});

  const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const header = ["title", "url", "read", "created"];

  const rows = items.map((item) =>
    [
      escapeCSV(item.title),
      escapeCSV(item.url),
      item.hasBeenRead,
      new Date(item.creationTime).toISOString(),
    ].join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  const dataUrl =
    "data:text/csv;charset=utf-8;base64," +
    btoa(unescape(encodeURIComponent(csv)));

  await chrome.downloads.download({
    url: dataUrl,
    filename: `reading_list_export.csv`,
    saveAs: true,
  });
});
