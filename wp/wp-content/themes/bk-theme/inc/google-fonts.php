<?php
/**
 * Build a Google Fonts URL from theme.json + optional fonts.config.json.
 * - theme.json supplies the family names (settings.typography.fontFamilies[*].name)
 * - fonts.config.json (optional) supplies weights/italics per family
 */

function mytheme_load_fonts_config(): array {
    $config_path = get_stylesheet_directory() . '/fonts.config.json';
    if ( file_exists( $config_path ) ) {
        $cfg = json_decode( file_get_contents( $config_path ), true );
        if ( is_array( $cfg ) ) {
            return $cfg;
        }
    }
    return [];
}

function mytheme_google_fonts_url_from_theme_json(): ?string {
    $theme_json_path = get_stylesheet_directory() . '/theme.json';
    if ( ! file_exists( $theme_json_path ) ) {
        return null;
    }

    $json = json_decode( file_get_contents( $theme_json_path ), true );
    if ( ! is_array( $json ) ) {
        return null;
    }

    $families = $json['settings']['typography']['fontFamilies'] ?? [];
    if ( ! is_array( $families ) || empty( $families ) ) {
        return null;
    }

    $config = mytheme_load_fonts_config(); // { "Saira": { "weights":[300,400,600,700], "ital": false }, ... }

    $params = [];

    foreach ( $families as $f ) {
        // Use the display name as the Google family unless you want a mapping here.
        $family = $f['name'] ?? null;
        if ( ! $family ) {
            continue;
        }

        $family_key = $family; // key into fonts.config.json
        $weights     = $config[$family_key]['weights'] ?? [400, 700];
        $ital        = ! empty( $config[$family_key]['ital'] );

        // Normalize family for URL
        $family_for_url = str_replace( ' ', '+', trim( $family ) );

        // Normalize weights
        $weights = array_values( array_unique( array_map( 'intval', (array) $weights ) ) );
        sort( $weights );
        if ( empty( $weights ) ) {
            $weights = [400, 700];
        }

        // Build variant string
        if ( $ital ) {
            // "ital,wght@0,400;0,700;1,400;1,700"
            $pairs = [];
            foreach ( [0, 1] as $i ) {
                foreach ( $weights as $w ) {
                    $pairs[] = "{$i},{$w}";
                }
            }
            $variant = 'ital,wght@' . implode( ';', $pairs );
        } else {
            // "wght@400;700"
            $variant = 'wght@' . implode( ';', $weights );
        }

        // Only encode the family name; keep ":" ";" "," as-is
        $params[] = 'family=' . $family_for_url . ':' . $variant;
    }

    if ( empty( $params ) ) {
        return null;
    }

    return 'https://fonts.googleapis.com/css2?' . implode( '&', $params ) . '&display=swap';
}

function mytheme_enqueue_google_fonts_from_theme_json() {
    $url = mytheme_google_fonts_url_from_theme_json();
    if ( $url ) {
        wp_enqueue_style( 'mytheme-google-fonts', $url, [], null );
    }
}
add_action( 'wp_enqueue_scripts', 'mytheme_enqueue_google_fonts_from_theme_json', 20 );

// Load same fonts in the block editor so WYSIWYG is actually WYSIWYG.
add_action( 'enqueue_block_editor_assets', function () {
    $url = mytheme_google_fonts_url_from_theme_json();
    if ( $url ) {
        wp_enqueue_style( 'mytheme-google-fonts-editor', $url, [], null );
    }
}, 20 );
