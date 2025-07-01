/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $ ) {

	// Site title and description.
	wp.customize( 'blogname', function( value ) {
		value.bind( function( to ) {
			$( '.site-title a' ).text( to );
		} );
	} );
	wp.customize( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).text( to );
		} );
	} );

	// Header text color (if you were using it).
	// wp.customize( 'header_textcolor', function( value ) {
	// 	value.bind( function( to ) {
	// 		if ( 'blank' === to ) {
	// 			$( '.site-title a, .site-description' ).css( {
	// 				'clip': 'rect(1px, 1px, 1px, 1px)',
	// 				'position': 'absolute'
	// 			} );
	// 		} else {
	// 			$( '.site-title a, .site-description' ).css( {
	// 				'clip': 'auto',
	// 				'position': 'relative'
	// 			} );
	// 			$( '.site-title a, .site-description' ).css( { // Or just .site-title a, .site-description if they share color
	// 				'color': to
	// 			} );
	// 		}
	// 	} );
	// } );

    // Example for Primary Color (if transport is postMessage)
    // wp.customize( 'collegenexis_primary_color', function( value ) {
    //     value.bind( function( newval ) {
    //         // Update CSS custom property or directly style elements
    //         document.documentElement.style.setProperty('--cn-primary-color', newval);
    //         // Example direct styling (less ideal than CSS variables)
    //         // $( 'a' ).css( 'color', newval );
    //     } );
    // } );

    // Example for Accent Color (if transport is postMessage)
    // wp.customize( 'collegenexis_accent_color', function( value ) {
    //     value.bind( function( newval ) {
    //         document.documentElement.style.setProperty('--cn-accent-color', newval);
    //         // Example direct styling
    //         // $( 'button' ).css( 'background-color', newval );
    //     } );
    // } );

    // Example for Font Changes (if transport is postMessage)
    // This is more complex as it might involve loading new font files or updating font stacks.
    // Typically, for font changes, 'refresh' is simpler unless you build a more sophisticated preview system.
    // wp.customize( 'collegenexis_heading_font', function( value ) {
    //     value.bind( function( newval ) {
    //         document.documentElement.style.setProperty('--cn-heading-font', newval + ', sans-serif');
    //     } );
    // } );
    // wp.customize( 'collegenexis_body_font', function( value ) {
    //     value.bind( function( newval ) {
    //         document.documentElement.style.setProperty('--cn-body-font', newval + ', sans-serif');
    //     } );
    // } );

} )( jQuery );
