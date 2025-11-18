// include.js —— 自动引入 + 自动高亮
document.addEventListener("DOMContentLoaded", function () {
    const includes = document.querySelectorAll("[w3-include-html]");
    includes.forEach(el => {
        const file = el.getAttribute("w3-include-html");
        fetch(file)
            .then(r => r.text())
            .then(html => {
                el.innerHTML = html;
                el.removeAttribute("w3-include-html");

                // 自动高亮当前页面
                const current = location.pathname.split("/").pop() || "index.html";
                document.querySelectorAll(".header-btn").forEach(btn => {
                    const target = btn.getAttribute("data-page") || "index.html";
                    const targetFile = target.split("/").pop();
                    if (targetFile === current) {
                        btn.classList.add("active");
                    }
                });
            });
    });
});