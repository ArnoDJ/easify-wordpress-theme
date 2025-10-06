(function () {
    const { createElement, Fragment } = wp.element;
    const { registerBlockType } = wp.blocks;
    const { MediaUpload, RichText, InspectorControls, useBlockProps } = wp.blockEditor;
    const { Button, PanelBody } = wp.components;

    registerBlockType('bk-theme/icon-text', {
        title: 'Icon Text',
        icon: 'format-image',
        category: 'widgets',
        attributes: {
            svgUrl: { type: 'string', default: '' },
            svgAlt: { type: 'string', default: '' },
            title: { type: 'string', default: '' },
            subtitle: { type: 'string', default: '' }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { svgUrl, svgAlt, title, subtitle } = attributes;

            const blockProps = useBlockProps({
                className: ['icon-text', props.className].join(' ')
            });

            const onSelectSvg = (media) => {
                setAttributes({
                    svgUrl: media.url,
                    svgAlt: media.alt || ''
                });
            };

        return createElement(
            Fragment,
            null,
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'Icon Settings' },
                    createElement(MediaUpload, {
                        onSelect: onSelectSvg,
                        allowedTypes: ['image/svg+xml'],
                        render: ({ open }) =>
                            createElement(
                                Button,
                                { onClick: open, variant: 'secondary' },
                                svgUrl ? 'Change SVG' : 'Select SVG'
                            )
                    })
                )
            ),
            createElement(
                'div',
                { ...blockProps, className: 'icon-text-wrapper icon-text' },
                svgUrl
                    ? createElement('img', {
                        src: svgUrl,
                        alt: svgAlt,
                        className: 'icon-text__icon'
                    })
                    : createElement('div', { className: 'icon-text__placeholder' }, 'No SVG'),
                createElement(
                    'div',
                    { className: 'icon-text__content' },
                    createElement(RichText, {
                        tagName: 'span',
                        value: title,
                        onChange: (value) => setAttributes({ title: value }),
                        placeholder: 'Title...',
                        className: 'icon-text__title'
                    }),
                    createElement(RichText, {
                        tagName: 'span',
                        value: subtitle,
                        onChange: (value) => setAttributes({ subtitle: value }),
                        placeholder: 'Subtitle...',
                        className: 'icon-text__subtitle'
                    })
                )
            )
        );
        },

        save: function (props) {
            const { attributes } = props;
            const { svgUrl, svgAlt, title, subtitle } = attributes;

            const blockProps = useBlockProps.save({
                className: 'icon-text'
            });

            return createElement(
                'div',
                blockProps,
                svgUrl &&
                    createElement('img', {
                        src: svgUrl,
                        alt: svgAlt,
                        className: 'icon-text__icon'
                    }),
                createElement(
                    'div',
                    { className: 'icon-text__content' },
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: title,
                        className: 'icon-text__title'
                    }),
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: subtitle,
                        className: 'icon-text__subtitle'
                    })
                )
            );
        }
    });
})();
