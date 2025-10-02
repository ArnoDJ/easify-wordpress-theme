(function() {
    const { createElement, useState } = wp.element;
    const { useBlockProps, RichText, InnerBlocks } = wp.blockEditor;

    wp.blocks.registerBlockType('bk-theme/accordion-item', {
        title: 'Accordion Item',
        parent: ['bk-theme/accordion-group'],
        icon: 'excerpt-view',
        category: 'design',
        attributes: {
            title: { type: 'string', default: 'Job Title' }
        },

        edit: function({ attributes, setAttributes }) {
            const { title } = attributes;
            const blockProps = useBlockProps();
            const [isOpen, setIsOpen] = useState(false);

            return createElement(
                "div",
                Object.assign({}, blockProps, {
                    className: "accordion-item" + (isOpen ? " open" : "")
                }),
                [
                    createElement(
                        "div",
                        {
                            className: "accordion-header",
                            onClick: function() {
                                setIsOpen(!isOpen);
                            }
                        },
                        [
                            createElement(RichText, {
                                tagName: "h3",
                                value: title,
                                onChange: function(val) {
                                    setAttributes({ title: val });
                                },
                                placeholder: "Title..."
                            }),
                            createElement(
                                "span",
                                { className: "accordion-icon" },
                                isOpen ? "−" : "+"
                            )
                        ]
                    ),
                    isOpen &&
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

        save: function({ attributes }) {
            const { title } = attributes;
            const blockProps = useBlockProps.save();

            return createElement(
                "div",
                Object.assign({}, blockProps, { className: "accordion-item" }),
                [
                    createElement(
                        "div",
                        { className: "accordion-header" },
                        [
                            createElement(RichText.Content, {
                                tagName: "h3",
                                value: title
                            }),
                            createElement("span", { className: "accordion-icon" }, "+")
                        ]
                    ),
                    createElement(
                        "div",
                        { className: "accordion-content" },
                        createElement(InnerBlocks.Content, null)
                    )
                ]
            );
        }
    });
})();
