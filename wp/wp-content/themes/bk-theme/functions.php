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
});

// =======================================================
// FRONTEND STYLES
// =======================================================
add_action('wp_enqueue_scripts', function () {
    $dir = get_stylesheet_directory();
    $uri = get_stylesheet_directory_uri();

    $add = function (string $handle, string $pathFromThemeRoot, array $deps = []) use ($dir, $uri) {
        $abs = $dir . $pathFromThemeRoot;
        if (! file_exists($abs)) return;
        wp_enqueue_style(
            $handle,
            $uri . $pathFromThemeRoot,
            $deps,
            filemtime($abs)
        );
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
    register_block_type( __DIR__ . '/blocks/feature-grid' );
    register_block_type( __DIR__ . '/blocks/feature-item' );
    register_block_type( __DIR__ . '/blocks/newsletter-signup');
});

// =======================================================
// CUSTOM BLOCK STYLES
// =======================================================
// ... (keep all your existing register_block_style code here unchanged)

// =======================================================
// BLOG POSTS BLOCK
// =======================================================
function bk_theme_register_blog_posts_block() {
    register_block_type( __DIR__ . '/blocks/blog-posts', array(
        'render_callback' => 'bk_theme_render_blog_posts_block'
    ) );
}
add_action( 'init', 'bk_theme_register_blog_posts_block' );

function bk_theme_render_blog_posts_block($attributes) {
    $query = new WP_Query(array(
        'post_type' => 'post',
        'posts_per_page' => 6
    ));

    ob_start();

    if ($query->have_posts()) {
        echo '<div class="bk-blog-grid">';
        while ($query->have_posts()) {
            $query->the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <a href="<?php the_permalink(); ?>">
                    <?php if (has_post_thumbnail()) {
                        the_post_thumbnail('medium');
                    } ?>
                    <h2><?php the_title(); ?></h2>
                    <p><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                </a>
            </article>
        <?php }
        echo '</div>';
        wp_reset_postdata();
    } else {
        echo '<p>' . __('No posts found.', 'bk-theme') . '</p>';
    }

    return ob_get_clean();
}

// in functions.php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        [],
        '6.5.2'
    );
});

