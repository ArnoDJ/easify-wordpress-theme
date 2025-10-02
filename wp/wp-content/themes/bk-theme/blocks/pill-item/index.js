(function() {
    const { createElement } = wp.element;
    const { useBlockProps, RichText, MediaUpload, InspectorControls, PanelColorSettings } = wp.blockEditor;
    const { PanelBody, ToggleControl, Button } = wp.components;

    wp.blocks.registerBlockType('bk-theme/pill-item', {
        title: 'Pill',
        icon: 'minus',
        category: 'design',
        parent: ['bk-theme/pill-row'],
        attributes: {
            text: { type: 'string', default: 'Label' },
            backgroundColor: { type: 'string', default: '#0c566c' },
            textColor: { type: 'string', default: '#ffffff' },
            stretch: { type: 'boolean', default: false },
            icon: { type: 'string', default: '' },        // raw SVG markup
            iconColor: { type: 'string', default: '#ffffff' }
        },
        edit: function({ attributes, setAttributes }) {
            const { text, backgroundColor, textColor, stretch, icon, iconColor } = attributes;
            const blockProps = useBlockProps({
                className: "pill" + (stretch ? " stretch" : ""),
                style: { backgroundColor, color: textColor }
            });

            return [
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: "Pill Settings" },
                        createElement(ToggleControl, {
                            label: "Stretch pill",
                            checked: stretch,
                            onChange: (val) => setAttributes({ stretch: val })
                        }),
                        createElement(MediaUpload, {
                            onSelect: (media) => {
                                // Fetch SVG markup when file is selected
                                fetch(media.url)
                                    .then(res => res.text())
                                    .then(svg => setAttributes({ icon: svg }));
                            },
                            allowedTypes: ['image/svg+xml'],
                            render: ({ open }) => createElement(Button, { onClick: open }, icon ? "Replace Icon" : "Upload Icon")
                        })
                    ),
                    createElement(PanelColorSettings, {
                        title: "Colors",
                        colorSettings: [
                            { value: backgroundColor, onChange: (val) => setAttributes({ backgroundColor: val }), label: 'Background' },
                            { value: textColor, onChange: (val) => setAttributes({ textColor: val }), label: 'Text' },
                            { value: iconColor, onChange: (val) => setAttributes({ iconColor: val }), label: 'Icon' }
                        ]
                    })
                ),
                createElement(
                    "div", blockProps,
                    icon && createElement("span", {
                        className: "pill-icon",
                        dangerouslySetInnerHTML: { __html: icon.replace(/fill=".*?"/g, `fill="${iconColor}"`) }
                    }),
                    createElement(RichText, {
                        tagName: "span",
                        value: text,
                        onChange: (val) => setAttributes({ text: val }),
                        placeholder: "Label..."
                    })
                )
            ];
        },
        save: function({ attributes }) {
            const { text, backgroundColor, textColor, stretch, icon, iconColor } = attributes;
            const blockProps = useBlockProps.save({
                className: "pill" + (stretch ? " stretch" : ""),
                style: { backgroundColor, color: textColor }
            });

            return createElement(
                "div", blockProps,
                icon && createElement("span", {
                    className: "pill-icon",
                    dangerouslySetInnerHTML: { 
                    __html: icon
                        // Replace existing fill
                        .replace(/fill="(.*?)"/g, `fill="${iconColor}"`)
                        // If no fill exists, inject one into <path> or <svg>
                        .replace(/<path /g, `<path fill="${iconColor}" `)
                        .replace(/<svg /g, `<svg fill="${iconColor}" `)
                    }
                }),
                createElement(RichText.Content, { tagName: "span", value: text })
            );
        }
    });
})();
