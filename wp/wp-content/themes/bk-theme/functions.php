<?php
/**
 * Theme Functions — bk-theme
 */

// =======================================================
// THEME SUPPORT + EDITOR STYLES
// =======================================================
add_action('after_setup_theme', function () {
    add_theme_support('editor-styles');

    // Load editor styles
    add_editor_style([
        'assets/css/base.css',
        'assets/css/layout.css',
        'assets/css/components/header.css',
        'assets/css/components/footer.css',
        'assets/css/utilities.css',
        'assets/css/block-styles.css',
        'blocks/content-bubble/editor.css',
    ]);

    error_log('bk-theme: ✅ after_setup_theme executed');
});

// =======================================================
// FRONTEND STYLES
// =======================================================
add_action('wp_enqueue_scripts', function () {
    $dir = get_stylesheet_directory();
    $uri = get_stylesheet_directory_uri();

    // Helper to enqueue only if the file exists
    $add = function (string $handle, string $pathFromThemeRoot, array $deps = []) use ($dir, $uri) {
        $abs = $dir . $pathFromThemeRoot;
        if (! file_exists($abs)) {
            error_log("bk-theme: ⚠️ missing $pathFromThemeRoot");
            return;
        }
        wp_enqueue_style(
            $handle,
            $uri . $pathFromThemeRoot,
            $deps,
            filemtime($abs)
        );
        error_log("bk-theme: ✅ enqueued $pathFromThemeRoot");
    };

    // Order matters: base → layout → components → utilities → block styles
    $add('bk-style',        '/style.css');
    $add('bk-base',         '/assets/css/base.css', ['bk-style']);
    $add('bk-layout',       '/assets/css/layout.css', ['bk-base']);
    $add('bk-header',       '/assets/css/components/header.css', ['bk-layout']);
    $add('bk-footer',       '/assets/css/components/footer.css', ['bk-layout']);
    $add('bk-utilities',    '/assets/css/utilities.css', ['bk-header', 'bk-footer']);
    $add('bk-block-styles', '/assets/css/block-styles.css', ['bk-utilities']);
}, 100);

// =======================================================
// CUSTOM BLOCKS
// =======================================================
add_action('init', function () {
    $block_path = get_stylesheet_directory() . '/blocks/content-bubble';

    if ( file_exists( $block_path . '/block.json' ) ) {
        register_block_type( $block_path );
        error_log('bk-theme: ✅ content-bubble REGISTERED');
    } else {
        error_log('bk-theme: ❌ content-bubble block.json missing at ' . $block_path);
    }
});

// =======================================================
// CUSTOM BLOCK STYLES
// =======================================================
add_action('init', function () {
    register_block_style('core/heading', [
        'name'  => 'hero-title',
        'label' => __('BK Title', 'bk-theme'),
    ]);
    register_block_style('core/paragraph', [
        'name'  => 'hero-lead',
        'label' => __('BK Lead', 'bk-theme'),
    ]);
    register_block_style('core/paragraph', [
        'name'  => 'hero-body',
        'label' => __('BK Body', 'bk-theme'),
    ]);
    register_block_style('core/buttons', [
        'name'  => 'hero-buttons',
        'label' => __('BK Buttons Row', 'bk-theme'),
    ]);
    register_block_style('core/button', [
        'name'  => 'hero-cta',
        'label' => __('BK CTA', 'bk-theme'),
    ]);

    register_block_style('bk-theme/content-bubble', [
        'name'  => 'allow-bleed',
        'label' => __('Allow Bleed', 'bk-theme'),
    ]);
});

// =======================================================
// EDITOR SCRIPTS (extra controls like bleed checkboxes)
// =======================================================
function bk_theme_enqueue_editor_assets() {
    $path = get_stylesheet_directory() . '/editor.js';
    $uri  = get_stylesheet_directory_uri() . '/editor.js';

    if (! file_exists($path)) {
        error_log('bk-theme: ⚠️ editor.js missing');
        return;
    }

    wp_enqueue_script(
        'bk-theme-editor-js',
        $uri,
        ['wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-element', 'wp-compose', 'wp-hooks', 'wp-block-editor'],
        filemtime($path),
        true
    );

    error_log('bk-theme: ✅ editor.js enqueued');
}
add_action('enqueue_block_editor_assets', 'bk_theme_enqueue_editor_assets', 20);

// =======================================================
// GOOGLE FONTS LOADER
// =======================================================
require_once __DIR__ . '/inc/google-fonts.php';

// =======================================================
// SHORTCODES (LANGUAGE SWITCHERS)
// =======================================================
add_shortcode('lang_switch', function($atts) {
    if (!function_exists('pll_the_languages')) return '';
    $args = shortcode_atts([
        'separator'    => ' / ',
        'hide_current' => '0',
    ], $atts);

    $langs = pll_the_languages([
        'raw'           => 1,
        'hide_if_empty' => 0,
        'hide_current'  => (int)$args['hide_current'],
    ]);
    if (empty($langs)) return '';

    $links = [];
    foreach ($langs as $l) {
        $code = strtoupper($l['slug']);
        $class = 'lang-link' . (!empty($l['current_lang']) ? ' is-active' : '');
        $links[] = sprintf(
            '<a class="%s" href="%s" hreflang="%s" lang="%s">%s</a>',
            esc_attr($class),
            esc_url($l['url']),
            esc_attr($l['slug']),
            esc_attr($l['slug']),
            esc_html($code)
        );
    }
    return '<nav class="lang-switcher" aria-label="Language switcher">' .
           implode(esc_html($args['separator']), $links) .
           '</nav>';
});

add_shortcode('polylang_switcher', function ($atts = []) {
    if (!function_exists('pll_the_languages')) return '';
    $args = shortcode_atts([
        'display_names_as'     => 'slug',
        'show_flags'           => 0,
        'show_names'           => 1,
        'hide_if_no_translation' => 1,
    ], $atts);

    ob_start();
    pll_the_languages($args);
    $html = ob_get_clean();

    return '<div class="bk-lang">' . $html . '</div>';
});
