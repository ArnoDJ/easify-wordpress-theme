(function (blocks, i18n, element) {
  const { registerBlockType } = blocks;
  const { __ } = i18n;
  const { createElement: el } = element;

  registerBlockType("bk-theme/blog-posts", {
    title: __("Blog Posts", "bk-theme"),
    icon: "list-view",
    category: "widgets",
    description: __("Displays recent blog posts in a grid with images and dates.", "bk-theme"),

    edit: function () {
      return el("p", {}, "Blog posts will be displayed on the site frontend.");
    },

    save: function () {
      return null; // Server-side render
    },
  });
})(window.wp.blocks, window.wp.i18n, window.wp.element);
