(function () {
    const { createElement, Fragment } = wp.element;
    const { registerBlockType } = wp.blocks;
    const { MediaUpload, RichText, InspectorControls, useBlockProps } = wp.blockEditor;
    const { Button, PanelBody } = wp.components;

    registerBlockType('bk-theme/team-member', {
        title: 'Team Member',
        icon: 'groups',
        category: 'widgets',
        attributes: {
            imageUrl: { type: 'string', default: '' },
            imageAlt: { type: 'string', default: '' },
            name: { type: 'string', default: '' },
            role: { type: 'string', default: '' }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { imageUrl, imageAlt, name, role } = attributes;

            const blockProps = useBlockProps({ className: 'team-member' });

            const onSelectImage = (media) => {
                setAttributes({
                    imageUrl: media.url,
                    imageAlt: media.alt
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
                        { title: 'Team Member Settings' },
                        createElement(MediaUpload, {
                            onSelect: onSelectImage,
                            allowedTypes: ['image'],
                            render: ({ open }) =>
                                createElement(
                                    Button,
                                    { onClick: open, variant: 'secondary' },
                                    imageUrl ? 'Change Image' : 'Select Image'
                                )
                        })
                    )
                ),
                createElement(
                    'div',
                    blockProps,
                    imageUrl
                        ? createElement('img', {
                              src: imageUrl,
                              alt: imageAlt,
                              className: 'team-member__image'
                          })
                        : createElement('div', { className: 'team-member__placeholder' }, 'No Image'),
                    createElement(RichText, {
                        tagName: 'h3',
                        value: name,
                        onChange: (value) => setAttributes({ name: value }),
                        placeholder: 'Name',
                        className: 'team-member__name'
                    }),
                    createElement(RichText, {
                        tagName: 'p',
                        value: role,
                        onChange: (value) => setAttributes({ role: value }),
                        placeholder: 'Function',
                        className: 'team-member__role'
                    })
                )
            );
        },

        save: function (props) {
            const { attributes } = props;
            const { imageUrl, imageAlt, name, role } = attributes;

            const blockProps = useBlockProps.save({ className: 'team-member' });

            return createElement(
                'div',
                blockProps,
                imageUrl &&
                    createElement('img', {
                        src: imageUrl,
                        alt: imageAlt,
                        className: 'team-member__image'
                    }),
                createElement(RichText.Content, {
                    tagName: 'h3',
                    value: name,
                    className: 'team-member__name'
                }),
                createElement(RichText.Content, {
                    tagName: 'p',
                    value: role,
                    className: 'team-member__role'
                })
            );
        }
    });
})();
