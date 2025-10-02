(function () {
  const { createElement } = wp.element;
  const { useBlockProps, InnerBlocks } = wp.blockEditor;

  wp.blocks.registerBlockType("bk-theme/feature-grid", {
    title: "Feature Grid",
    icon: "screenoptions",
    category: "design",
    supports: {
      align: ["wide", "full"],
    },

    edit: function () {
      const blockProps = useBlockProps({ className: "feature-grid" });

      return createElement(
        "div",
        blockProps,
        createElement(InnerBlocks, {
          allowedBlocks: ["bk-theme/feature-item"],
          template: [
            ["bk-theme/feature-item"],
            ["bk-theme/feature-item"],
            ["bk-theme/feature-item"],
            ["bk-theme/feature-item"],
          ],
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },

    save: function () {
      const blockProps = useBlockProps.save({ className: "feature-grid" });

      return createElement("div", blockProps, createElement(InnerBlocks.Content, null));
    },
  });
})();
