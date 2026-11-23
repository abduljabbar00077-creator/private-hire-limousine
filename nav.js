(function () {
  var MAX_MENU = 5;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function links(list) {
    return list.slice(0, MAX_MENU).map(function (a) {
      return '<a href="' + esc(a.url) + '">' + esc(a.title) + '</a>';
    }).join("") + '<a href="/articles/">All articles</a>';
  }
  function addBar(list) {
    var css = '.plbar{position:relative;z-index:100;background:#0b1b36;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 20px;font:500 .95rem system-ui,sans-serif}' +
      '.plbar a,.plbar summary{color:#f7f4ee;text-decoration:none;cursor:pointer;list-style:none}.plbar summary::-webkit-details-marker{display:none}' +
      '.plbar .logo{font-weight:700;color:#d8bd88}.plr{display:flex;align-items:center;gap:18px}' +
      '.plbar summary,.plq{white-space:nowrap}.plq{border:1px solid #d8bd88;padding:6px 12px;border-radius:2px}' +
      '.plm{position:absolute;left:0;right:0;top:100%;background:#0b1b36;display:flex;flex-direction:column;padding:6px 20px 12px;border-top:1px solid rgba(216,189,136,.3)}' +
      '.plm a{padding:10px 0}';
    var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    var bar = document.createElement("div"); bar.className = "plbar";
    bar.innerHTML = '<a class="logo" href="/">Private Hire Limousine</a><div class="plr"><details id="pld"><summary>Travel Guide &#9662;</summary><div class="plm">' + links(list) + '</div></details><a class="plq" href="/#book">Get a quote</a></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    document.addEventListener("click", function (e) {
      var d = document.getElementById("pld");
      if (d && !d.contains(e.target)) d.removeAttribute("open");
    });
  }
  function run(list) {
    var menus = document.querySelectorAll("[data-articles-menu] .ddm");
    for (var i = 0; i < menus.length; i++) menus[i].innerHTML = links(list);
    if (document.body.hasAttribute("data-article-page")) addBar(list);
    var all = document.getElementById("all-articles");
    if (all) {
      all.innerHTML = list.map(function (a) {
        return '<li><a href="' + esc(a.url) + '">' + esc(a.title) + '</a><p>' + esc(a.description || "") + '</p></li>';
      }).join("");
    }
  }
  fetch("/articles.json").then(function (r) { return r.json(); }).then(run).catch(function () {});
})();
