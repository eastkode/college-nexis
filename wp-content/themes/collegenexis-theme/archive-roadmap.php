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
					<?php
						the_archive_title( '<h1 class="page-title">', '</h1>' );
						the_archive_description( '<div class="archive-description">', '</div>' );
					?>
				</header><!-- .page-header -->

				<div class="roadmap-listings-list"> <?php // Changed to list, can be styled as grid too ?>
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
					?>
					<article id="post-<?php the_ID(); ?>" <?php post_class('roadmap-card'); ?>>
						<div class="roadmap-card-inner">
							<div class="roadmap-card-content">
								<?php the_title(sprintf('<h2 class="entry-title roadmap-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>

								<?php
								$introduction = get_field('roadmap_introduction');
								if ($introduction) :
									// Display a truncated version of the introduction
									$excerpt = wp_trim_words(wp_strip_all_tags($introduction), 30, '...'); // Get 30 words
									?>
									<p class="roadmap-card-excerpt"><?php echo esc_html($excerpt); ?></p>
								<?php elseif (has_excerpt()) : ?>
                                    <p class="roadmap-card-excerpt"><?php the_excerpt(); ?></p>
                                <?php endif; ?>

								<a href="<?php the_permalink(); ?>" class="button roadmap-card-button"><?php esc_html_e('View Roadmap', 'collegenexis-theme'); ?></a>
							</div>
						</div>
					</article><!-- #post-<?php the_ID(); ?> -->
					<?php
				endwhile;
				?>
				</div> <!-- .roadmap-listings-list -->
				<?php

				the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
