document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementById('closeModal');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageIndicator = document.getElementById('pageIndicator');
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const canvas = document.getElementById('pdfCanvas');
  const ctx = canvas.getContext('2d');

  // inline embedded preview elements
  const inlineContainer = document.getElementById('inlinePreviewContainer');
  const inlineFrame = document.getElementById('inlinePreview');
  const closeInline = document.getElementById('closeInlinePreview');

  let pdfDoc = null;
  let pageNum = 1;
  let pageCount = 0;
  let scale = 1.0; // user zoom multiplier
  let currentFileUrl = null;

  function showModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // cleanup
    if (pdfDoc) {
      pdfDoc = null;
    }
    currentFileUrl = null;
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function renderPage(num) {
    if (!pdfDoc) return;
    const page = await pdfDoc.getPage(num);
    // compute scale to fit container width
    const parent = canvas.parentElement;
    const containerWidth = Math.max(300, parent.clientWidth - 24);
    const viewport = page.getViewport({ scale: 1 });
    const desiredScale = (containerWidth / viewport.width) * scale;

    const vp = page.getViewport({ scale: desiredScale });
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = Math.floor(vp.width) + 'px';
    canvas.style.height = Math.floor(vp.height) + 'px';
    const renderContext = {
      canvasContext: ctx,
      viewport: vp
    };
    // scale the context for device pixel ratio
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render(renderContext).promise;
    pageIndicator.textContent = `${pageNum} / ${pageCount}`;
  }

  function queueRenderPage(num) {
    if (num < 1) num = 1;
    if (num > pageCount) num = pageCount;
    pageNum = num;
    renderPage(pageNum);
  }

  async function openPdf(url) {
    try {
      // decode spaces for loading via http
      const decoded = decodeURIComponent(url);
      currentFileUrl = url;
      // load PDF
      const loadingTask = pdfjsLib.getDocument(url);
      pdfDoc = await loadingTask.promise;
      pageCount = pdfDoc.numPages;
      pageNum = 1;
      scale = 1.0;
      showModal();
      await renderPage(pageNum);
    } catch (err) {
      console.error('Error loading PDF', err);
      alert('Impossible de charger le document. Servez la page via http si vous êtes en file://.');
    }
  }

  document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', () => {
      const file = btn.getAttribute('data-file');
      if (!file) return;
      openPdf(file);
    });
  });

  // helper to generate embeddable preview URLs for Google Drive/Docs
  function getEmbedUrl(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('drive.google.com')) {
        const m = url.match(/\/d\/([A-Za-z0-9_-]+)/);
        if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
        const idParam = u.searchParams.get('id');
        if (idParam) return `https://drive.google.com/file/d/${idParam}/preview`;
      }
      if (u.hostname.includes('docs.google.com')) {
        const m = url.match(/\/d\/([A-Za-z0-9_-]+)/);
        if (m) return `https://docs.google.com/document/d/${m[1]}/preview`;
      }
    } catch (e) {}
    return url;
  }

  // 'Voir' inline preview buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const file = btn.getAttribute('data-file');
      if (!file) return;
      const embed = getEmbedUrl(file);
      if (!inlineContainer || !inlineFrame) return;
      inlineFrame.src = embed;
      inlineContainer.style.display = 'block';
      inlineContainer.scrollIntoView({ behavior: 'smooth' });
    });
  });

  if (closeInline) {
    closeInline.addEventListener('click', () => {
      if (inlineFrame) inlineFrame.src = '';
      if (inlineContainer) inlineContainer.style.display = 'none';
    });
  }

  prevBtn.addEventListener('click', () => {
    if (pageNum <= 1) return;
    queueRenderPage(pageNum - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (pageNum >= pageCount) return;
    queueRenderPage(pageNum + 1);
  });

  zoomIn.addEventListener('click', async () => {
    scale = Math.min(3, scale + 0.25);
    await renderPage(pageNum);
  });
  zoomOut.addEventListener('click', async () => {
    scale = Math.max(0.25, scale - 0.25);
    await renderPage(pageNum);
  });

  closeBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });
});
