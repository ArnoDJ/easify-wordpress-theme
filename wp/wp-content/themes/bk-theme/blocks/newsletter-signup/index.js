( function( blocks, i18n, element ) {
    const { registerBlockType } = blocks;
    const { __ } = i18n;
    const { createElement: el } = element;

    registerBlockType('bk-theme/newsletter-signup', {
        title: __('Newsletter Signup', 'bk-theme'),
        icon: 'email',
        category: 'widgets',
        edit: function() {
            return el('form', { className: 'bk-newsletter' }, [
                el('input', {
                    type: 'email',
                    placeholder: __('jouw e-mailadres', 'bk-theme'),
                }),
                el('button', { type: 'submit' }, [
                    __('Blijf op de hoogte', 'bk-theme'),
                    el('i', { className: 'fa-solid fa-arrow-right' })
                ])
            ]);
        },
        save: function() {
            return el('form', { className: 'bk-newsletter' }, [
                el('input', {
                    type: 'email',
                    placeholder: __('jouw e-mailadres', 'bk-theme'),
                }),
                el('button', { type: 'submit' }, [
                    __('Blijf op de hoogte', 'bk-theme'),
                    el('i', { className: 'fa-solid fa-arrow-right' })
                ])
            ]);
        }
    });
} )( window.wp.blocks, window.wp.i18n, window.wp.element );
