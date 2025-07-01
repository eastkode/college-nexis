<?php
/**
 * The template for displaying all single Roadmap posts
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<div class="container">
			<?php
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content', get_post_type() ); // Uses content-roadmap.php if it exists

				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous Roadmap:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next Roadmap:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
					)
				);

			endwhile; // End of the loop.
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
