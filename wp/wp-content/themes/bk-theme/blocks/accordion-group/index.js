(function() {
    const { createElement } = wp.element;
    const { useBlockProps, InnerBlocks } = wp.blockEditor;

    wp.blocks.registerBlockType('bk-theme/accordion-group', {
        title: 'Accordion Group',
        icon: 'index-card',
        category: 'design',

        edit: function() {
            const blockProps = useBlockProps();

            return createElement(
                "div",
                Object.assign({}, blockProps, { className: "accordion-group" }),
                createElement(InnerBlocks, {
                    allowedBlocks: ["bk-theme/accordion-item"],
                    orientation: "vertical",
                    template: [
                        ["bk-theme/accordion-item"],
                        ["bk-theme/accordion-item"]
                    ],
                    renderAppender: InnerBlocks.ButtonBlockAppender
                })
            );
        },

        save: function() {
            const blockProps = useBlockProps.save();

            return createElement(
                "div",
                Object.assign({}, blockProps, { className: "accordion-group" }),
                createElement(InnerBlocks.Content, null)
            );
        }
    });
})();
