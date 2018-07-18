/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class CKEditor extends React.Component {
	constructor( props ) {
		super( props );

		// After mounting the editor, the variable will contain a reference to created editor.
		// @see: https://docs.ckeditor.com/ckeditor5/latest/api/module_core_editor_editor-Editor.html
		this.editor = null;
	}

	componentDidUpdate( newProps ) {
		if ( this.editor && newProps.data ) {
			this.editor.setData( newProps.data );
		}
	}

	// Initialize editor when component is mounted.
	componentDidMount() {
		this._initializeEditor();
	}

	// Destroy editor before unmouting component.
	componentWillUnmount() {
		this._destroyEditor();
	}

	// Render <div> element which will be replaced by CKEditor.
	render() {
		return (
			<div ref={ ref => ( this.domContainer = ref ) }></div>
		);
	}

	_initializeEditor() {
		this.props.editor
			.create( this.domContainer, this.props.config )
			.then( editor => {
				this.editor = editor;
				this.editor.setData( this.props.data );

				if ( this.props.onInit ) {
					this.props.onInit( this.editor );
				}

				if ( this.props.onChange ) {
					const document = this.editor.model.document;

					document.on( 'change', () => {
						if ( document.differ.getChanges().length > 0 ) {
							this.props.onChange( editor.getData() );
						}
					} );
				}
			} )
			.catch( error => {
				console.error( error );
			} );
	}

	_destroyEditor() {
		if ( this.editor ) {
			this.editor.destroy();
		}
	}
}

// Properties definition.
CKEditor.propTypes = {
	editor: PropTypes.func.isRequired,
	data: PropTypes.string,
	config: PropTypes.object,
	onChange: PropTypes.func,
	onInit: PropTypes.func
};

// Default values for non-required properties.
CKEditor.defaultProps = {
	data: '',
	config: {}
};

