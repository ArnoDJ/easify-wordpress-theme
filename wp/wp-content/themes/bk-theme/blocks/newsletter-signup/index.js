(function (blocks, i18n, element, blockEditor) {
    const { registerBlockType } = blocks;
    const { __ } = i18n;
    const { createElement: el } = element;
    const { useBlockProps } = blockEditor;

    registerBlockType('bk-theme/newsletter-signup', {
        title: __('Newsletter Signup', 'bk-theme'),
        icon: 'email',
        category: 'widgets',

        edit: function () {
            // explicitly apply block props to a wrapping div
            const blockProps = useBlockProps({ className: 'bk-newsletter-wrapper' });

            return el(
                'div',
                blockProps,
                el('form', { className: 'bk-newsletter' }, [
                    el('input', {
                        type: 'email',
                        placeholder: __('jouw e-mailadres', 'bk-theme'),
                        readOnly: true, // prevent typing in editor
                    }),
                    el('button', { type: 'button', disabled: true }, [
                        __('Blijf op de hoogte', 'bk-theme'),
                        el('i', { className: 'fa-solid fa-arrow-right' }),
                    ]),
                ])
            );
        },

        save: function () {
            // we don’t need useBlockProps here — only frontend HTML
            return el('form', { className: 'bk-newsletter' }, [
                el('input', {
                    type: 'email',
                    placeholder: __('jouw e-mailadres', 'bk-theme'),
                }),
                el('button', { type: 'submit' }, [
                    __('Blijf op de hoogte', 'bk-theme'),
                    el('i', { className: 'fa-solid fa-arrow-right' }),
                ]),
            ]);
        },
    });
})(window.wp.blocks, window.wp.i18n, window.wp.element, window.wp.blockEditor);
