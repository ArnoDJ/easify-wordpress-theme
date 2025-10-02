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

    // Order matters
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
add_action('init', function() {
    register_block_type( __DIR__ . '/blocks/content-bubble' );
    register_block_type( __DIR__ . '/blocks/svg-icon' );
    register_block_type( __DIR__ . '/blocks/icon-feature' );
    register_block_type( __DIR__ . '/blocks/accordion-group' );
    register_block_type( __DIR__ . '/blocks/accordion-item' );
    register_block_type( __DIR__ . '/blocks/pill-item' );
    register_block_type( __DIR__ . '/blocks/pill-row' );
});

// =======================================================
// CUSTOM BLOCK STYLES
// =======================================================
add_action('init', function () {
    $styles = [
        ['core/heading', 'hero-title',   'BK Title'],
        ['core/paragraph', 'hero-lead',  'BK Lead'],
        ['core/paragraph', 'hero-body',  'BK Body'],
        ['core/buttons',   'hero-buttons','BK Buttons Row'],
        ['core/button',    'hero-cta',   'BK CTA'],
        ['bk-theme/content-bubble', 'allow-bleed', 'Allow Bleed'],
    ];

    foreach ($styles as [$block, $name, $label]) {
        register_block_style($block, [
            'name'         => $name,
            'label'        => __($label, 'bk-theme'),
            'style_handle' => 'bk-block-styles',
        ]);
    }

    // Extra heading font-weight variations
    register_block_style('core/heading', [
        'name'  => 'light',
        'label' => __('Light'),
        'inline_style' => '.is-style-light { font-weight: 300; }'
    ]);

    register_block_style('core/heading', [
        'name'  => 'semibold',
        'label' => __('Semi Bold'),
        'inline_style' => '.is-style-semibold { font-weight: 600; }'
    ]);

    register_block_style('core/heading', [
        'name'  => 'black',
        'label' => __('Black'),
        'inline_style' => '.is-style-black { font-weight: 900; }'
    ]);

    // Two-column group variation
    register_block_style('core/group', [
        'name'  => 'two-col',
        'label' => __('Two Columns (50/50)', 'bk-theme'),
    ]);

    // Image bleed variations
    $sides = ['left', 'right'];
    $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
    foreach ($sides as $side) {
        foreach ($sizes as $key => $label) {
            register_block_style('core/image', [
                'name'  => "bleed-{$side}-{$key}",
                'label' => __("Bleed " . ucfirst($side) . " ({$label})", 'bk-theme'),
                'style_handle' => 'bk-block-styles',
            ]);
        }
    }
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

add_action('init', function() {
    register_block_style('core/paragraph', [
        'name'  => 'verynarrow',
        'label' => __('Wide (500px)'),
        'inline_style' => '.is-style-verynarrow { max-width: 500px; margin-left:auto; margin-right:auto; }'
    ]);
    register_block_style('core/paragraph', [
        'name'  => 'narrow',
        'label' => __('Narrow (650px)'),
        'inline_style' => '.is-style-narrow { max-width: 650px; margin-left:auto; margin-right:auto; }'
    ]);

    register_block_style('core/paragraph', [
        'name'  => 'medium',
        'label' => __('Medium (900px)'),
        'inline_style' => '.is-style-medium { max-width: 900px; margin-left:auto; margin-right:auto; }'
    ]);

    register_block_style('core/paragraph', [
        'name'  => 'wide',
        'label' => __('Wide (1200px)'),
        'inline_style' => '.is-style-wide { max-width: 1200px; margin-left:auto; margin-right:auto; }'
    ]);
});

