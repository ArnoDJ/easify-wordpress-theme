(function() {
    const { createElement } = wp.element;
    const { useBlockProps, RichText, InnerBlocks } = wp.blockEditor;

    wp.blocks.registerBlockType('bk-theme/accordion-item', {
        title: 'Accordion Item',
        parent: ['bk-theme/accordion-group'],
        icon: 'excerpt-view',
        category: 'design',
        attributes: {
            title: { type: 'string', default: 'Job Title' }
        },

        // EDITOR view: always open, title editable
        edit: function({ attributes, setAttributes }) {
            const { title } = attributes;
            const blockProps = useBlockProps({
                className: "accordion-item is-editing open"
            });

            return createElement(
                "div",
                blockProps,
                [
                    createElement(
                        "div",
                        { className: "accordion-header" },
                        [
                            createElement(RichText, {
                                tagName: "h3",
                                value: title,
                                onChange: (val) => setAttributes({ title: val }),
                                placeholder: "Job Title…",
                                className: "accordion-title"
                            }),
                            createElement("span", { className: "accordion-icon" }, "+")
                        ]
                    ),
                    createElement(
                        "div",
                        { className: "accordion-content" },
                        createElement(InnerBlocks, {
                            placeholder: "Add blocks for job description here…"
                        })
                    )
                ]
            );
        },

        // FRONTEND view: toggle handled by JS
        save: function({ attributes }) {
            const { title } = attributes;
            const blockProps = useBlockProps.save({
                className: "accordion-item"
            });

            return createElement(
                "div",
                blockProps,
                [
                    createElement(
                        "div",
                        { className: "accordion-header" },
                        [
                            createElement(RichText.Content, {
                                tagName: "h3",
                                value: title,
                                className: "accordion-title"
                            }),
                            createElement("span", { className: "accordion-icon" }, "+")
                        ]
                    ),
                    createElement(
                        "div",
                        { className: "accordion-content" },
                        createElement(InnerBlocks.Content)
                    )
                ]
            );
        }
    });
})();
