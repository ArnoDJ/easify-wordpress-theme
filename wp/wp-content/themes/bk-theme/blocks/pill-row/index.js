(function() {
    const { createElement } = wp.element;
    const { useBlockProps, InnerBlocks } = wp.blockEditor;

    wp.blocks.registerBlockType('bk-theme/pill-row', {
        title: 'Pill Row',
        icon: 'editor-ol',
        category: 'design',
        edit: function() {
            const blockProps = useBlockProps({ className: "pill-row" });
            return createElement(
                "div",
                blockProps,
                createElement(InnerBlocks, {
                    allowedBlocks: ['bk-theme/pill-item'],
                    orientation: "horizontal",
                    renderAppender: InnerBlocks.ButtonBlockAppender
                })
            );
        },
        save: function() {
            const blockProps = useBlockProps.save({ className: "pill-row" });
            return createElement(
                "div",
                blockProps,
                createElement(InnerBlocks.Content, null)
            );
        }
    });
})();
