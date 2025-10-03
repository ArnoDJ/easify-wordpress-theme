( function( blocks, i18n, element, serverSideRender ) {
    const { registerBlockType } = blocks;
    const { __ } = i18n;
    const { createElement: el } = element;
    const ServerSideRender = serverSideRender;

    registerBlockType('bk-theme/blog-posts', {
        title: __('Blog Posts', 'bk-theme'),
        icon: 'list-view',
        category: 'widgets',
        edit: function() {
            return el(ServerSideRender, { block: 'bk-theme/blog-posts' });
        },
        save: function() {
            return null; // Server-side render only
        }
    });
} )(
    window.wp.blocks,
    window.wp.i18n,
    window.wp.element,
    window.wp.serverSideRender
);
