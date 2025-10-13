<?php
/**
 * Blog Posts — server-side render
 */

// Helper: safely get first image from post content
if (!function_exists('bk_theme_get_first_image')) {
    function bk_theme_get_first_image($post_content) {
        if (empty($post_content)) {
            return '';
        }
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $post_content, $match)) {
            return esc_url_raw($match[1]);
        }
        return '';
    }
}

$query = new WP_Query([
    'post_type'      => 'post',
    'posts_per_page' => 6,
]);

if (!$query->have_posts()) {
    echo '<p>' . esc_html__('No posts found.', 'bk-theme') . '</p>';
    return;
}
?>

<div class="bk-blog-grid">
    <?php while ($query->have_posts()) : $query->the_post(); ?>
        <?php
        // Pick the image: featured > first inline > none
        $image_html = '';

        if (has_post_thumbnail()) {
            $image_html = get_the_post_thumbnail(get_the_ID(), 'large', ['loading' => 'lazy']);
        } else {
            $first_image = bk_theme_get_first_image(get_the_content());
            if (!empty($first_image)) {
                $image_html = sprintf(
                    '<img src="%s" alt="%s" loading="lazy" />',
                    esc_url($first_image),
                    esc_attr(get_the_title())
                );
            }
        }
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('bk-blog-card'); ?>>
            <a href="<?php the_permalink(); ?>" class="bk-blog-link">
                <?php if (!empty($image_html)) : ?>
                    <div class="bk-blog-image">
                        <?php echo $image_html; ?>
                    </div>
                <?php endif; ?>

                <div class="bk-blog-content">
                    <h2 class="bk-blog-title"><?php the_title(); ?></h2>
                    <p class="bk-blog-date"><?php echo esc_html(get_the_date()); ?></p>
                    <p class="bk-blog-excerpt">
                        <?php echo esc_html(wp_trim_words(get_the_excerpt(), 20)); ?>
                    </p>
                </div>
            </a>
        </article>
    <?php endwhile; ?>
</div>

<?php wp_reset_postdata(); ?>
