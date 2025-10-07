(function () {
    const { createElement: el } = wp.element;
    const { __ } = wp.i18n;
    const {
        useBlockProps,
        RichText,
        InspectorControls,
        PanelColorSettings,
    } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl } = wp.components;

    wp.blocks.registerBlockType("bk-theme/pill-button", {
        title: __("Pill Button", "bk-theme"),
        icon: "admin-links",
        category: "design",
        attributes: {
            text: { type: "string", default: "Zin in een kennismaking?" },
            url: { type: "string", default: "" },
            backgroundColor: {
                type: "string",
                default: "var(--wp--preset--color--yellow)",
            },
            textColor: {
                type: "string",
                default: "var(--wp--preset--color--dark-blue)",
            },
            arrowColor: {
                type: "string",
                default: "var(--wp--preset--color--dark-blue)",
            },
            paddingSize: {
                type: "string",
                default: "normal", // normal, small, large
            },
        },

        edit: function ({ attributes, setAttributes }) {
            const {
                text,
                url,
                backgroundColor,
                textColor,
                arrowColor,
                paddingSize,
            } = attributes;

            const blockProps = useBlockProps({
                className: `pill pill--${paddingSize}`,
                style: { backgroundColor, color: textColor },
            });

            return [
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: __("Button Settings", "bk-theme") },
                        el(TextControl, {
                            label: __("Button URL", "bk-theme"),
                            value: url,
                            onChange: (val) => setAttributes({ url: val }),
                        }),
                        el(SelectControl, {
                            label: __("Padding Size", "bk-theme"),
                            value: paddingSize,
                            options: [
                                { label: __("Small", "bk-theme"), value: "small" },
                                { label: __("Normal", "bk-theme"), value: "normal" },
                                { label: __("Large", "bk-theme"), value: "large" },
                            ],
                            onChange: (val) => setAttributes({ paddingSize: val }),
                        })
                    ),
                    el(PanelColorSettings, {
                        title: __("Colors", "bk-theme"),
                        colorSettings: [
                            {
                                value: backgroundColor,
                                onChange: (val) =>
                                    setAttributes({ backgroundColor: val }),
                                label: __("Background", "bk-theme"),
                            },
                            {
                                value: textColor,
                                onChange: (val) => setAttributes({ textColor: val }),
                                label: __("Text", "bk-theme"),
                            },
                            {
                                value: arrowColor,
                                onChange: (val) => setAttributes({ arrowColor: val }),
                                label: __("Arrow", "bk-theme"),
                            },
                        ],
                    })
                ),
                el(
                    "a",
                    { ...blockProps, href: url || "#" },
                    el(RichText, {
                        tagName: "span",
                        className: "pill-text",
                        value: text,
                        onChange: (val) => setAttributes({ text: val }),
                        placeholder: __("Button text…", "bk-theme"),
                    }),
                    el("span", {
                        className: "pill-icon",
                        dangerouslySetInnerHTML: {
                            __html: `
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="${arrowColor}"
                                    stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            `,
                        },
                    })
                ),
            ];
        },

        save: function ({ attributes }) {
            const {
                text,
                url,
                backgroundColor,
                textColor,
                arrowColor,
                paddingSize,
            } = attributes;

            const blockProps = useBlockProps.save({
                className: `pill pill--${paddingSize}`,
                style: { backgroundColor, color: textColor },
            });

            return el(
                "a",
                { ...blockProps, href: url || "#" },
                el(RichText.Content, {
                    tagName: "span",
                    className: "pill-text",
                    value: text,
                }),
                el("span", {
                    className: "pill-icon",
                    dangerouslySetInnerHTML: {
                        __html: `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="${arrowColor}"
                                stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        `,
                    },
                })
            );
        },
    });
})();
