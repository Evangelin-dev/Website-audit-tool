import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const C = {
  primary:  [37, 99, 235],
  dark:     [15, 23, 42],
  surface:  [248, 250, 252],
  border:   [226, 232, 240],
  text:     [30, 41, 59],
  muted:    [100, 116, 139],
  green:    [22, 163, 74],
  red:      [220, 38, 38],
  amber:    [202, 138, 4],
  purple:   [124, 58, 237],
  white:    [255, 255, 255],
};

function scoreColor(val) {
  if (typeof val !== 'number') return C.muted;
  return val >= 80 ? C.green : val >= 50 ? C.amber : C.red;
}

export function downloadAuditPDF(result) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();
  const H   = doc.internal.pageSize.getHeight();
  const M   = 15;
  const CW  = W - M * 2;
  let   y   = M;

  const now    = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  const domain = result.domain || result.url || '';

  const checkPage = (needed) => {
    if (y + (needed || 25) > H - 18) { doc.addPage(); y = M; }
  };

  const sectionHeader = (title) => {
    checkPage(20);
    doc.setFillColor(...C.primary);
    doc.rect(M, y, 3, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...C.text);
    doc.text(title, M + 7, y + 5.8);
    y += 15;
  };

  const divider = () => {
    checkPage(8);
    doc.setDrawColor(...C.border);
    doc.line(M, y, W - M, y);
    y += 9;
  };

  const statCards = (cards, cardH) => {
    const h = cardH || 22;
    checkPage(h + 10);
    const n  = cards.length;
    const cw = (CW - (n - 1) * 4) / n;
    cards.forEach(function(card, i) {
      const x = M + i * (cw + 4);
      doc.setFillColor(...C.surface);
      doc.setDrawColor(...C.border);
      doc.roundedRect(x, y, cw, h, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...card[2]);
      doc.text(String(card[0]), x + cw / 2, y + h * 0.54, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.muted);
      doc.text(card[1].toUpperCase(), x + cw / 2, y + h * 0.83, { align: 'center' });
    });
    y += h + 10;
  };

  const table = (head, body, colStyles, headColor, extra) => {
    const hc    = headColor || C.primary;
    const cs    = colStyles || {};
    const xtra  = extra || {};
    checkPage(20);
    autoTable(doc, Object.assign({
      startY: y,
      head: [head],
      body: body,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: { top: 3, right: 5, bottom: 3, left: 5 },
        lineColor: C.border,
        lineWidth: 0.15,
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: {
        fillColor: hc,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
      },
      alternateRowStyles: { fillColor: [248, 250, 255] },
      columnStyles: cs,
      tableWidth: CW,
      margin: { left: M, right: M },
      didParseCell: function(data) {
        if (data.section !== 'body') return;
        var v = String(data.cell.raw).toLowerCase().trim();
        var green  = ['set', 'found', 'optimal', 'present', 'secured', 'none missing', 'pass', 'yes'];
        var red    = ['missing', 'not found', 'not set', 'not secured', 'broken', 'fail', 'no'];
        var amber  = ['multiple h1s', 'none found', 'warn'];
        if (green.indexOf(v) >= 0 || v.indexOf('set (') === 0 || v.indexOf('grade ') === 0) {
          data.cell.styles.textColor = C.green;
        } else if (red.indexOf(v) >= 0 || (v.indexOf('missing') >= 0 && v.indexOf('none') < 0) || v.indexOf('not ') === 0) {
          data.cell.styles.textColor = C.red;
        } else if (amber.indexOf(v) >= 0 || v.indexOf('multiple') === 0) {
          data.cell.styles.textColor = C.amber;
        }
      },
    }, xtra));
    y = doc.lastAutoTable.finalY + 10;
  };

  // =========================================================================
  // COVER PAGE
  // =========================================================================
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, W, 88, 'F');
  doc.setFillColor(...C.primary);
  doc.rect(0, 85, W, 4, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 150, 180);
  doc.text('WEBSITE AUDIT REPORT', M, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.white);
  doc.text('Comprehensive Site Analysis', M, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 170, 210);
  var urlLines = doc.splitTextToSize(result.url || domain, CW);
  doc.text(urlLines.slice(0, 2), M, 44);

  var metaItems = [
    ['DOMAIN',        domain.replace(/https?:\/\//i, '').substring(0, 30)],
    ['REPORT DATE',   now.substring(0, 26)],
    ['ANALYSIS TIME', (result.analysis_duration_seconds ? result.analysis_duration_seconds.toFixed(2) : '--') + ' sec'],
    ['HTTP STATUS',   String(result.status_code || 200)],
  ];
  var mColW = CW / metaItems.length;
  metaItems.forEach(function(item, i) {
    var x = M + i * mColW;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 120, 160);
    doc.text(item[0], x, 62);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(220, 230, 248);
    doc.text(String(item[1]), x, 70);
  });

  y = 100;

  // =========================================================================
  // SCORE SUMMARY
  // =========================================================================
  var scores = [
    ['SEO',         result.seo         ? (result.seo.score         != null ? result.seo.score         : result.seo_score         || '--') : (result.seo_score         || '--')],
    ['Security',    result.security    ? (result.security.score    != null ? result.security.score    : result.security_score    || '--') : (result.security_score    || '--')],
    ['Performance', result.performance ? (result.performance.score != null ? result.performance.score : result.performance_score || '--') : (result.performance_score || '--')],
    ['Links',       result.links       ? (result.links.score       != null ? result.links.score       : '--') : '--'],
    ['Mobile',      result.mobile      ? (result.mobile.score      != null ? result.mobile.score      : '--') : '--'],
  ];

  var scW = (CW - (scores.length - 1) * 3) / scores.length;
  scores.forEach(function(s, i) {
    var x = M + i * (scW + 3);
    doc.setFillColor(...C.surface);
    doc.setDrawColor(...C.border);
    doc.roundedRect(x, y, scW, 28, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...scoreColor(typeof s[1] === 'number' ? s[1] : parseFloat(s[1])));
    doc.text(String(s[1]), x + scW / 2, y + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(s[0].toUpperCase(), x + scW / 2, y + 24, { align: 'center' });
  });
  y += 34;
  divider();

  // =========================================================================
  // PERFORMANCE
  // =========================================================================
  sectionHeader('Performance');

  var respTime  = result.response_time_ms  != null ? result.response_time_ms  : (result.performance ? (result.performance.response_time_ms  || 0) : 0);
  var pageBytes = result.page_size_bytes   != null ? result.page_size_bytes   : (result.performance ? (result.performance.page_size_bytes   || 0) : 0);
  var pageMB    = result.page_size_mb      != null ? result.page_size_mb      : pageBytes / 1048576;
  var totalReqs = result.total_requests    != null ? result.total_requests    : (result.performance ? (result.performance.total_requests    || 0) : 0);
  var isMobile  = result.mobile ? (result.mobile.is_mobile_friendly != null ? result.mobile.is_mobile_friendly : false) : (result.is_mobile_friendly || false);

  statCards([
    [respTime + ' ms',                   'Response Time',   respTime < 800  ? C.green : respTime < 2000  ? C.amber : C.red],
    [Number(pageMB).toFixed(2) + ' MB',  'Page Size',       pageMB < 2      ? C.green : pageMB < 5       ? C.amber : C.red],
    [String(totalReqs),                  'Total Requests',  C.primary],
    [isMobile ? 'Yes' : 'No',            'Mobile Friendly', isMobile        ? C.green : C.red],
  ]);

  table(
    ['Resource Type', 'Count', 'Description'],
    [
      ['Scripts',     String(result.script_requests     != null ? result.script_requests     : 0), 'JavaScript files loaded on the page'],
      ['Stylesheets', String(result.stylesheet_requests != null ? result.stylesheet_requests : 0), 'CSS stylesheets linked in the document'],
      ['Images',      String(result.image_requests      != null ? result.image_requests      : 0), 'Image elements found in the page HTML'],
      ['Iframes',     String(result.iframe_requests     != null ? result.iframe_requests     : 0), 'Embedded iframes detected'],
    ],
    {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
    }
  );
  divider();

  // =========================================================================
  // SEO
  // =========================================================================
  checkPage(60);
  sectionHeader('Search Engine Optimisation (SEO)');

  var mt  = result.meta_description ? String(result.meta_description) : '';
  var ogD = result.og_description   ? String(result.og_description)   : '';
  var ogI = result.og_image         ? String(result.og_image)         : '';

  table(
    ['Attribute', 'Value', 'Status'],
    [
      ['Page Title',
        result.title ? String(result.title).substring(0, 72) : 'Not set',
        result.title ? 'Set (' + (result.title_length || String(result.title).length) + ' chars)' : 'Missing'],
      ['Meta Description',
        mt ? mt.substring(0, 72) : 'Not set',
        mt ? 'Set (' + (result.meta_description_length || mt.length) + ' chars)' : 'Missing'],
      ['H1 Tags',
        String(result.h1_count != null ? result.h1_count : 0),
        result.h1_count === 1 ? 'Optimal' : (result.h1_count > 1 ? 'Multiple H1s' : 'Missing')],
      ['H2 Tags',
        String(result.h2_count != null ? result.h2_count : 0),
        (result.h2_count || 0) > 0 ? 'Present' : 'None found'],
      ['Canonical URL',
        result.canonical_tag || 'Not set',
        result.canonical_tag ? 'Set' : 'Not set'],
      ['Robots Meta',
        result.robots_meta_tag || 'Not set',
        result.robots_meta_tag ? 'Set' : 'Not set'],
      ['XML Sitemap',
        result.sitemap_url || (result.sitemap_exists ? 'Found' : 'Not found'),
        result.sitemap_exists ? 'Found' : 'Not found'],
      ['Robots.txt',
        result.robots_txt_exists ? 'Found' : 'Not found',
        result.robots_txt_exists ? 'Found' : 'Not found'],
      ['OG Title',
        result.og_title ? String(result.og_title).substring(0, 55) : 'Not set',
        result.og_title ? 'Set' : 'Not set'],
      ['OG Description',
        ogD ? ogD.substring(0, 55) : 'Not set',
        ogD ? 'Set' : 'Not set'],
      ['OG Image',
        ogI ? ogI.substring(0, 55) : 'Not set',
        ogI ? 'Set' : 'Not set'],
    ],
    {
      0: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 34 },
    }
  );
  divider();

  // =========================================================================
  // SECURITY
  // =========================================================================
  checkPage(50);
  sectionHeader('Security');

  var headersObj = result.security_headers || {};
  var headerRows = Object.entries(headersObj).map(function(entry) {
    var present = entry[1] !== 'Missing' && String(entry[1]).toLowerCase().indexOf('missing') < 0;
    return [entry[0], present ? String(entry[1]).substring(0, 62) : '--', present ? 'Present' : 'Missing'];
  });

  table(
    ['Security Header', 'Value', 'Status'],
    [
      ['HTTPS Enabled',    result.https_enabled ? 'Yes' : 'No',
       result.https_enabled ? 'Secured' : 'Not secured'],
      ['SSL Grade',        result.ssl_grade || 'N/A',
       result.ssl_grade ? 'Grade ' + result.ssl_grade : 'N/A'],
      ['Missing Headers',  String((result.missing_headers || []).length),
       (result.missing_headers || []).length === 0 ? 'None missing' : (result.missing_headers || []).length + ' missing'],
    ].concat(headerRows),
    {
      0: { cellWidth: 55, fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontSize: 7.5 },
      2: { cellWidth: 30 },
    }
  );
  divider();

  // =========================================================================
  // LINKS
  // =========================================================================
  checkPage(50);
  sectionHeader('Links Analysis');

  statCards([
    [String(result.total_links    != null ? result.total_links    : 0), 'Total Links', C.primary],
    [String(result.internal_links != null ? result.internal_links : 0), 'Internal',    C.primary],
    [String(result.external_links != null ? result.external_links : 0), 'External',    C.purple],
    [String(result.broken_links   != null ? result.broken_links   : 0), 'Broken',      (result.broken_links || 0) > 0 ? C.red : C.green],
  ], 22);

  var brokenList = (result.broken_links_list || []).slice(0, 30);
  if (brokenList.length > 0) {
    table(
      ['#', 'URL', 'Status Code'],
      brokenList.map(function(link, i) {
        return [String(i + 1), String(link.url || link).substring(0, 90), String(link.status_code || 'Error')];
      }),
      { 0: { cellWidth: 12, halign: 'center' }, 2: { cellWidth: 28, halign: 'center' } },
      C.red
    );
  } else {
    checkPage(14);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...C.green);
    doc.text('All links are working correctly - no broken links detected.', M, y + 6);
    y += 16;
  }
  divider();

  // =========================================================================
  // IMAGES
  // =========================================================================
  checkPage(50);
  sectionHeader('Images Analysis');

  statCards([
    [String(result.total_images       != null ? result.total_images       : 0), 'Total Images', C.primary],
    [String(result.broken_images      != null ? result.broken_images      : 0), 'Broken',       (result.broken_images      || 0) > 0 ? C.red   : C.green],
    [String(result.images_missing_alt != null ? result.images_missing_alt : 0), 'Missing Alt',  (result.images_missing_alt || 0) > 0 ? C.amber : C.green],
  ], 22);

  var brokenImgs = (result.broken_images_list || []).slice(0, 20);
  if (brokenImgs.length > 0) {
    table(
      ['#', 'Image URL', 'Issue'],
      brokenImgs.map(function(img, i) {
        return [String(i + 1), String(img.src || img.url || img).substring(0, 90), 'Broken'];
      }),
      { 0: { cellWidth: 12, halign: 'center' }, 2: { cellWidth: 24, halign: 'center' } },
      C.amber
    );
  } else {
    checkPage(14);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...C.green);
    doc.text('No broken images detected. All images load correctly.', M, y + 6);
    y += 16;
  }
  divider();

  // =========================================================================
  // RECOMMENDATIONS
  // =========================================================================
  checkPage(50);
  sectionHeader('Key Recommendations');

  var recs = [];
  if (!result.title)
    recs.push(['SEO', 'Page title is missing', 'High']);
  if (!result.meta_description)
    recs.push(['SEO', 'Meta description is missing', 'High']);
  if ((result.h1_count || 0) === 0)
    recs.push(['SEO', 'No H1 heading found - add exactly one H1 per page', 'Medium']);
  if ((result.h1_count || 0) > 1)
    recs.push(['SEO', 'Multiple H1 tags detected - use exactly one', 'Medium']);
  if (!result.sitemap_exists)
    recs.push(['SEO', 'XML sitemap not found - add one to improve crawlability', 'Medium']);
  if (!result.robots_txt_exists)
    recs.push(['SEO', 'robots.txt not found - add one to guide search crawlers', 'Low']);
  if (!result.https_enabled)
    recs.push(['Security', 'HTTPS is not enabled - migrate to SSL/TLS immediately', 'Critical']);
  (result.missing_headers || []).forEach(function(h) {
    recs.push(['Security', 'Missing security header: ' + h, 'Medium']);
  });
  if ((result.broken_links || 0) > 0)
    recs.push(['Links', result.broken_links + ' broken link(s) detected - fix or remove them', 'High']);
  if ((result.images_missing_alt || 0) > 0)
    recs.push(['Accessibility', result.images_missing_alt + ' image(s) missing alt text - add descriptive alt attributes', 'Medium']);
  if (respTime > 2000)
    recs.push(['Performance', 'Slow response time (' + respTime + ' ms) - optimise server or use a CDN', 'High']);
  if (!isMobile)
    recs.push(['Mobile', 'Page is not mobile-friendly - add a responsive viewport meta tag', 'High']);

  if (recs.length === 0) {
    checkPage(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C.green);
    doc.text('No major issues found - your website is in great shape!', M, y + 5);
    y += 16;
  } else {
    table(
      ['Area', 'Finding', 'Priority'],
      recs,
      {
        0: { cellWidth: 30, fontStyle: 'bold' },
        2: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
      },
      C.primary,
      {
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 2) {
            var v = String(data.cell.raw);
            if      (v === 'Critical') data.cell.styles.textColor = [180, 0,   0];
            else if (v === 'High')     data.cell.styles.textColor = C.red;
            else if (v === 'Medium')   data.cell.styles.textColor = C.amber;
            else if (v === 'Low')      data.cell.styles.textColor = C.muted;
          }
        },
      }
    );
  }

  // =========================================================================
  // FOOTER - every page
  // =========================================================================
  var totalPages = doc.internal.getNumberOfPages();
  for (var p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...C.border);
    doc.line(M, H - 13, W - M, H - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    var footerDomain = domain.replace(/https?:\/\//i, '').substring(0, 55);
    doc.text(
      'Website Audit Dashboard  |  ' + now + '  |  ' + footerDomain,
      W / 2, H - 7, { align: 'center' }
    );
    doc.text('Page ' + p + ' of ' + totalPages, W - M, H - 7, { align: 'right' });
  }

  // =========================================================================
  // SAVE
  // =========================================================================
  var safeDomain = (domain || 'website')
    .replace(/https?:\/\//gi, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 40);
  doc.save('audit-report-' + safeDomain + '.pdf');
}