<?php
/**
 * Theme Functions — bk-theme
 */

// =======================================================
// THEME SUPPORT + EDITOR STYLES
// =======================================================
add_action('after_setup_theme', function () {
	add_theme_support('editor-styles');

	add_editor_style([
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
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
		if (!file_exists($abs)) return;
		wp_enqueue_style(
			$handle,
			$uri . $pathFromThemeRoot,
			$deps,
			filemtime($abs)
		);
	};

	$add('bk-style', '/style.css');
	$add('bk-base', '/assets/css/base.css', ['bk-style']);
	$add('bk-layout', '/assets/css/layout.css', ['bk-base']);
	$add('bk-header', '/assets/css/components/header.css', ['bk-layout']);
	$add('bk-footer', '/assets/css/components/footer.css', ['bk-layout']);
	$add('bk-utilities', '/assets/css/utilities.css', ['bk-header', 'bk-footer']);
	$add('bk-block-styles', '/assets/css/block-styles.css', ['bk-utilities']);
}, 100);

// =======================================================
// ENQUEUE FONT AWESOME FRONTEND
// =======================================================
add_action('wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'font-awesome',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
		[],
		'6.5.2'
	);
});

// =======================================================
// LOAD BLOCK STYLES + FONTS + SCRIPTS IN EDITOR
// =======================================================
add_action('enqueue_block_editor_assets', function () {
	// Block styles
	wp_enqueue_style(
		'bk-block-styles-editor',
		get_stylesheet_directory_uri() . '/assets/css/block-styles.css',
		[],
		filemtime(get_stylesheet_directory() . '/assets/css/block-styles.css')
	);

	// Google font: Saira
	wp_enqueue_style(
		'bk-theme-font-saira',
		'https://fonts.googleapis.com/css2?family=Saira:wght@100;200;300;400;500;600;700;800;900&display=swap',
		[],
		null
	);

	// Editor JavaScript (block extensions + formats)
	$path = get_stylesheet_directory() . '/editor.js';
	$uri  = get_stylesheet_directory_uri() . '/editor.js';
	if (file_exists($path)) {
		wp_enqueue_script(
			'bk-theme-editor-js',
			$uri,
			[
				'wp-blocks',
				'wp-element',
				'wp-rich-text',
				'wp-editor',
				'wp-block-editor',
				'wp-components',
				'wp-compose',
				'wp-i18n',
				'wp-hooks',
			],
			filemtime($path),
			true
		);
	}
}, 50);

// =======================================================
// ENSURE FONT AWESOME LOADS INSIDE EDITOR IFRAME (LATE)
// =======================================================
add_action('enqueue_block_editor_assets', function () {
	wp_enqueue_style(
		'bk-font-awesome-editor',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
		[],
		'6.5.2',
		'all'
	);
}, 999);

// =======================================================
// CUSTOM BLOCKS
// =======================================================
add_action('init', function () {
	register_block_type(__DIR__ . '/blocks/content-bubble');
	register_block_type(__DIR__ . '/blocks/svg-icon');
	register_block_type(__DIR__ . '/blocks/icon-feature');
	register_block_type(__DIR__ . '/blocks/accordion-group');
	register_block_type(__DIR__ . '/blocks/accordion-item');
	register_block_type(__DIR__ . '/blocks/pill-item');
	register_block_type(__DIR__ . '/blocks/pill-row');
	register_block_type(__DIR__ . '/blocks/feature-grid');
	register_block_type(__DIR__ . '/blocks/feature-item');
	register_block_type(__DIR__ . '/blocks/newsletter-signup');
	register_block_type(__DIR__ . '/blocks/icon-text');
	register_block_type(__DIR__ . '/blocks/icon-description');
	register_block_type(__DIR__ . '/blocks/pill-button');
	register_block_type(__DIR__ . '/blocks/side-image-content-block');
	register_block_type(__DIR__ . '/blocks/blog-posts');
	register_block_type(__DIR__ . '/blocks/review-carousel');
});


function bk_theme_render_blog_posts_block($attributes) {
	$query = new WP_Query([
		'post_type'      => 'post',
		'posts_per_page' => 6,
	]);

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
			<?php
		}
		echo '</div>';
		wp_reset_postdata();
	} else {
		echo '<p>' . __('No posts found.', 'bk-theme') . '</p>';
	}

	return ob_get_clean();
}

// =======================================================
// REGISTER "LEADING ARROW" STYLE FOR PARAGRAPH
// =======================================================
add_action('init', function () {
	register_block_style('core/paragraph', [
		'name'  => 'leading-arrow',
		'label' => __('Leading Arrow', 'bk-theme'),
	]);
});

// =======================================================
// REGISTER TEAM MEMBER BLOCK
// =======================================================
function bk_theme_register_team_member_block() {
	$dir = get_template_directory() . '/blocks/team-member';
	$script_handle = 'bk-theme-team-member';

	wp_register_script(
		$script_handle,
		get_template_directory_uri() . '/blocks/team-member/index.js',
		['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor']
	);

	wp_register_style(
		'bk-theme-team-member-editor',
		get_template_directory_uri() . '/blocks/team-member/editor.css',
		['wp-edit-blocks']
	);

	wp_register_style(
		'bk-theme-team-member',
		get_template_directory_uri() . '/blocks/team-member/style.css'
	);

	register_block_type(
		$dir,
		[
			'editor_script' => $script_handle,
			'editor_style'  => 'bk-theme-team-member-editor',
			'style'         => 'bk-theme-team-member',
		]
	);
}
add_action('init', 'bk_theme_register_team_member_block');

// =======================================================
// LOG SIDE-IMAGE-CONTENT-BLOCK REGISTRATION STATUS (for debugging)
// =======================================================
add_action('init', function () {
	$registry = WP_Block_Type_Registry::get_instance();
	if ($registry->is_registered('bk-theme/side-image-content-block')) {
		error_log('✅ Block is registered correctly');
	} else {
		error_log('❌ Block NOT registered');
	}
});

// =======================================================
// Force Font Awesome to load inside the block editor iframe
// =======================================================
add_filter('block_editor_settings_all', function ($editor_settings) {
	if (empty($editor_settings['styles'])) {
		$editor_settings['styles'] = [];
	}

	$editor_settings['styles'][] = [
		'css' => '',
		'__unstableType' => 'link',
		'href' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
	];

	return $editor_settings;
});

add_action('after_setup_theme', function() {
	add_theme_support('editor-styles');
	add_editor_style('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
});

// =======================================================
// ULTIMATE FIX — force Font Awesome into the editor iframe
// =======================================================
add_action('admin_footer', function () {
	if (!is_admin() || !get_current_screen() || !get_current_screen()->is_block_editor()) return;
	?>
	<script>
		document.addEventListener('DOMContentLoaded', () => {
			const observer = new MutationObserver(() => {
				const iframe = document.querySelector('iframe[name="editor-canvas"], iframe.block-editor-canvas, .edit-post-visual-editor iframe');
				if (iframe && iframe.contentDocument && !iframe.contentDocument.querySelector('#bk-fa-fix')) {
					const link = iframe.contentDocument.createElement('link');
					link.id = 'bk-fa-fix';
					link.rel = 'stylesheet';
					link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
					iframe.contentDocument.head.appendChild(link);
					console.log('🔥 Injected Font Awesome into editor iframe');
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		});
	</script>
	<?php
});

// =======================================================
// Load persistent arrow color support inside editor iframe
// =======================================================
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'bk-theme-editor-arrow-style',
        get_stylesheet_directory_uri() . '/assets/css/editor-arrow.css',
        [],
        filemtime(get_stylesheet_directory() . '/assets/css/editor-arrow.css')
    );
});

add_action('wp_print_scripts', function() {
    global $wp_scripts;
    foreach ($wp_scripts->queue as $handle) {
        $src = $wp_scripts->registered[$handle]->src ?? '';
        if (strpos($src, 'react') !== false) {
            error_log("⚠️ React script detected: $handle => $src");
        }
    }
});

function bk_enqueue_swiper_assets() {
  // Swiper CSS
  wp_enqueue_style(
    'swiper',
    'https://unpkg.com/swiper/swiper-bundle.min.css',
    [],
    null
  );

  // Swiper JS
  wp_enqueue_script(
    'swiper',
    'https://unpkg.com/swiper/swiper-bundle.min.js',
    [],
    null,
    true
  );
}
add_action('wp_enqueue_scripts', 'bk_enqueue_swiper_assets');

/**
 * Ensure review-carousel styles load AFTER Swiper to hide default arrows
 */
add_action('wp_enqueue_scripts', function () {
    // Path setup
    $path = get_stylesheet_directory() . '/blocks/review-carousel/style.css';
    $uri  = get_stylesheet_directory_uri() . '/blocks/review-carousel/style.css';

    // Only enqueue if it exists
    if (file_exists($path)) {
        wp_enqueue_style(
            'bk-review-carousel-style',
            $uri,
            ['swiper'], // <-- makes sure it loads AFTER Swiper
            filemtime($path)
        );
    }

    // Nuclear CSS fix for Swiper arrow duplication
    wp_add_inline_style('bk-review-carousel-style', '
        .swiper-button-next::after,
        .swiper-button-prev::after,
        .bk-review-carousel .swiper-button-next::after,
        .bk-review-carousel .swiper-button-prev::after {
            content: none !important;
            display: none !important;
            background: none !important;
            mask: none !important;
            -webkit-mask: none !important;
        }
    ');
}, 110);

add_action('wp_footer', function () { ?>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Remove Swiper's default inline SVG arrows (used in Swiper 10+)
      const cleanUpArrows = () => {
        document.querySelectorAll('.swiper-button-prev svg, .swiper-button-next svg')
          .forEach(svg => svg.remove());
      };

      // Run once on load
      cleanUpArrows();

      // Observe DOM changes (Swiper may re-inject SVGs)
      const observer = new MutationObserver(cleanUpArrows);
      observer.observe(document.body, { childList: true, subtree: true });
    });
  </script>
<?php });


