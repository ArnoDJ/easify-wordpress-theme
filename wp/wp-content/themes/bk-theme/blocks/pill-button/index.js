(function () {
    const { createElement } = wp.element;
    const { useBlockProps, RichText, InspectorControls, PanelColorSettings } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;

    wp.blocks.registerBlockType('bk-theme/pill-button', {
        title: 'Pill Button',
        icon: 'admin-links',
        category: 'design',
        attributes: {
            text: { type: 'string', default: 'Zin in een kennismaking?' },
            url: { type: 'string', default: '' },
            backgroundColor: { type: 'string', default: '#FDBB30' },
            textColor: { type: 'string', default: '#135A70' },
            arrowColor: { type: 'string', default: '#135A70' }
        },

        edit: function ({ attributes, setAttributes }) {
            const { text, url, backgroundColor, textColor, arrowColor } = attributes;

            const blockProps = useBlockProps({
                className: 'pill',
                style: { backgroundColor, color: textColor }
            });

            return [
                createElement(
                    InspectorControls,
                    {},
                    createElement(
                        PanelBody,
                        { title: 'Button Settings' },
                        createElement(TextControl, {
                            label: 'Button URL',
                            value: url,
                            onChange: (val) => setAttributes({ url: val })
                        })
                    ),
                    createElement(PanelColorSettings, {
                        title: 'Colors',
                        colorSettings: [
                            { value: backgroundColor, onChange: (val) => setAttributes({ backgroundColor: val }), label: 'Background' },
                            { value: textColor, onChange: (val) => setAttributes({ textColor: val }), label: 'Text' },
                            { value: arrowColor, onChange: (val) => setAttributes({ arrowColor: val }), label: 'Arrow' }
                        ]
                    })
                ),
                createElement(
                    'a',
                    { ...blockProps, href: url || '#' },
                    createElement(RichText, {
                        tagName: 'span',
                        className: 'pill-text', // 👈 added class
                        value: text,
                        onChange: (val) => setAttributes({ text: val }),
                        placeholder: 'Button text…'
                    }),
                    createElement(
                        'span',
                        {
                            className: 'pill-icon',
                            dangerouslySetInnerHTML: {
                                __html: `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="${arrowColor}"
                                        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                `
                            }
                        }
                    )
                )
            ];
        },

        save: function ({ attributes }) {
            const { text, url, backgroundColor, textColor, arrowColor } = attributes;

            const blockProps = useBlockProps.save({
                className: 'pill',
                style: { backgroundColor, color: textColor }
            });

            return createElement(
                'a',
                { ...blockProps, href: url || '#' },
                createElement(RichText.Content, {
                    tagName: 'span',
                    className: 'pill-text', // 👈 added class
                    value: text
                }),
                createElement('span', {
                    className: 'pill-icon',
                    dangerouslySetInnerHTML: {
                        __html: `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="${arrowColor}"
                                stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        `
                    }
                })
            );
        }
    });
})();
