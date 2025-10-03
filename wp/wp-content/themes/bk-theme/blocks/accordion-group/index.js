(function() {
    const { createElement } = wp.element;
    const { useBlockProps, InnerBlocks } = wp.blockEditor;

    wp.blocks.registerBlockType('bk-theme/accordion-group', {
        title: 'Accordion Group',
        icon: 'list-view',
        category: 'design',
        supports: {
            align: true
        },
        edit: function() {
            const blockProps = useBlockProps({
                className: 'accordion-group',
            });

            return createElement(
                "div",
                blockProps,
                createElement(InnerBlocks, {
                    allowedBlocks: ['bk-theme/accordion-item'],
                    template: [
                        ['bk-theme/accordion-item', { title: 'Job Title' }]
                    ],
                    renderAppender: InnerBlocks.ButtonBlockAppender
                })
            );
        },
        save: function() {
            const blockProps = useBlockProps.save({
                className: 'accordion-group',
            });

            return createElement(
                "div",
                blockProps,
                createElement(InnerBlocks.Content)
            );
        }
    });
})();
