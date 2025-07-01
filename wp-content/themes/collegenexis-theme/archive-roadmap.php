<?php
/**
 * The template for displaying archive pages for the Roadmap CPT
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<div class="container">
			<?php if ( have_posts() ) : ?>

				<header class="page-header">
					<?php
						the_archive_title( '<h1 class="page-title">', '</h1>' );
						the_archive_description( '<div class="archive-description">', '</div>' );
					?>
				</header><!-- .page-header -->

				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					get_template_part( 'template-parts/content', get_post_type() ); // content-roadmap.php or content.php

				endwhile;

				the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
