<?php
/**
 * Plugin Name: JC WP Favorite Media
 * Description: This plugin allows you to mark media files as favorites and adds a tab in the media modal to display only the media marked as favorite to allow select favorite media more quickly.
 * Version: 0.1
 * Author: juanbits
 * Author URI: github.com/juanbits
 */

// Add a "Favorite" checkbox to the media file list in the media modal.
add_filter( 'attachment_fields_to_edit', 'favorite_media_attachment_fields_to_edit', 10, 2 );
function favorite_media_attachment_fields_to_edit( $form_fields, $post ) {
    $form_fields['favorite'] = array(
        'label' => __( 'Favorite', 'jc-wp-favorite-media' ),
        'input' => 'checkbox',
        'value' => get_post_meta( $post->ID, '_favorite', true )
    );
    return $form_fields;
}

// Save the "Favorite" checkbox value when a media file is updated in the media modal.
add_filter( 'attachment_fields_to_save', 'favorite_media_attachment_fields_to_save', 10, 2 );
function favorite_media_attachment_fields_to_save( $post, $attachment ) {
    if ( isset( $attachment['favorite'] ) ) {
        update_post_meta( $post['ID'], '_favorite', $attachment['favorite'] );
    }

    return $post;
}

// Load custom JavaScript for the "Favorites" tab functionality in the media modal.
add_action( 'admin_enqueue_scripts', 'favorite_media_enqueue_scripts' );
function favorite_media_enqueue_scripts() {
    wp_enqueue_script( 'favorite-media-js', plugin_dir_url( __FILE__ ) . 'js/favorite-media.js', [ 'jquery', 'media-views' ], '1.0', true );
}

class JcFavoriteMediaLibrary{
	public function init(){
		wp_enqueue_script(
			'ade-media-library',
			get_stylesheet_directory_uri() . '/ademedia.js',
			['jquery', 'media-views']
		);
		add_action("print_media_templates", [$this, 'add_media_templates']);
	}
		public function add_media_templates(){
		?>
		<script type="text/html" id="tmpl-ademedia">
<script type="text/html" id="attachments-wrapper-tmpl">
<h3>hola {{ data.name }}</h3>
  <ul class="attachments-wrapper">
    
  </ul>
</script>
		</script>
		<?php
		}

}
$jcFavoriteMediaLibrary = new JcFavoriteMediaLibrary();
$jcFavoriteMediaLibrary->init();