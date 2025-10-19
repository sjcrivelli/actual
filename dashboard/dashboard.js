// Dashboard navigation and search
fetch('docs.json')
  .then(res => res.json())
  .then(docs => {
    const docList = document.getElementById('doc-list');
    const viewer = document.getElementById('doc-content');
    const search = document.getElementById('search');
    let currentDoc = null;

    function renderList(filter = '') {
      docList.innerHTML = '';
      docs.forEach((doc, i) => {
        if (!filter || doc.headings.some(h => h.toLowerCase().includes(filter.toLowerCase()))) {
          const li = document.createElement('li');
          li.textContent = doc.title;
          li.onclick = () => loadDoc(i);
          if (currentDoc === i) li.classList.add('active');
          docList.appendChild(li);
        }
      });
    }

    function loadDoc(idx) {
      currentDoc = idx;
      renderList(search.value);
      viewer.innerHTML = marked.parse(docs[idx].content);
    }

    search.oninput = () => renderList(search.value);
    renderList();
  });
