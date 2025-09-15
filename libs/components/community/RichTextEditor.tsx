import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Divider, Tooltip } from '@mui/material';
import {
	FormatBold as BoldIcon,
	FormatItalic as ItalicIcon,
	FormatUnderlined as UnderlineIcon,
	FormatListBulleted as BulletListIcon,
	FormatListNumbered as NumberListIcon,
	Link as LinkIcon,
	Image as ImageIcon,
	Code as CodeIcon,
	FormatQuote as QuoteIcon
} from '@mui/icons-material';

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	onChange,
	placeholder = "Start writing...",
	minHeight = 300
}) => {
	const editorRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = React.useState(false);

	useEffect(() => {
		if (editorRef.current && editorRef.current.innerHTML !== value) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	const handleInput = () => {
		if (editorRef.current) {
			// Ensure we get the full content including spaces and multiple words
			const content = editorRef.current.innerHTML;
			console.log('RichTextEditor input:', content); // Debug log
			onChange(content);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Handle some common shortcuts
		if (e.ctrlKey || e.metaKey) {
			switch (e.key) {
				case 'b':
					e.preventDefault();
					executeCommand('bold');
					break;
				case 'i':
					e.preventDefault();
					executeCommand('italic');
					break;
				case 'u':
					e.preventDefault();
					executeCommand('underline');
					break;
			}
		}
	};

	const handleKeyUp = () => {
		// Additional event handler to catch all text changes
		handleInput();
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		// Ensure pasted content is handled properly
		e.preventDefault();
		const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
		document.execCommand('insertHTML', false, text);
		handleInput();
	};

	const executeCommand = (command: string, value?: string) => {
		document.execCommand(command, false, value || '');
		editorRef.current?.focus();
		handleInput();
	};

	const toolbarButtons = [
		{ command: 'bold', icon: <BoldIcon />, tooltip: 'Bold (Ctrl+B)' },
		{ command: 'italic', icon: <ItalicIcon />, tooltip: 'Italic (Ctrl+I)' },
		{ command: 'underline', icon: <UnderlineIcon />, tooltip: 'Underline (Ctrl+U)' },
		{ divider: true },
		{ command: 'insertUnorderedList', icon: <BulletListIcon />, tooltip: 'Bullet List' },
		{ command: 'insertOrderedList', icon: <NumberListIcon />, tooltip: 'Numbered List' },
		{ divider: true },
		{ command: 'formatBlock', value: 'blockquote', icon: <QuoteIcon />, tooltip: 'Quote' },
		{ command: 'formatBlock', value: 'pre', icon: <CodeIcon />, tooltip: 'Code Block' }
	];

	return (
		<Paper
			variant="outlined"
			sx={{
				borderRadius: '12px',
				// Removed overflow: 'hidden' to prevent text input issues
				border: isFocused ? '2px solid' : '1px solid',
				borderColor: isFocused ? 'primary.main' : 'divider',
				transition: 'border-color 0.3s ease'
			}}
		>
			{/* Toolbar */}
			<Box
													component="div"
													
				
				sx={{
					display: 'flex',
					alignItems: 'center',
					px: 2,
					py: 1,
					bgcolor: 'grey.50',
					borderBottom: '1px solid',
					borderColor: 'divider',
					flexWrap: 'wrap',
					gap: 0.5
				}}
			>
				{toolbarButtons.map((button, index) => (
					button.divider ? (
						<Divider key={index} orientation="vertical" flexItem sx={{ mx: 0.5 }} />
					) : (
						<Tooltip key={index} title={button.tooltip || ''}>
							<IconButton
								size="small"
								onClick={() => {
									(executeCommand as any)(button.command, button.value);
								}}
								sx={{
									borderRadius: '8px',
									'&:hover': {
										bgcolor: 'primary.light',
										color: 'primary.contrastText'
									}
								}}
							>
								{button.icon}
							</IconButton>
						</Tooltip>
					)
				))}
			</Box>

			{/* Editor */}
			<Box
													component="div"
													
				
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				onKeyUp={handleKeyUp}
				onPaste={handlePaste}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onKeyDown={handleKeyDown}
				sx={{
					minHeight: `${minHeight}px`,
					p: 3,
					outline: 'none',
					fontSize: '16px',
					lineHeight: 1.6,
					color: 'text.primary',
					wordWrap: 'break-word',
					whiteSpace: 'pre-wrap',
					'&:empty::before': {
						content: `"${placeholder}"`,
						color: 'text.secondary',
						fontStyle: 'italic'
					},
					'& h1, & h2, & h3, & h4, & h5, & h6': {
						fontWeight: 700,
						marginTop: '1.5em',
						marginBottom: '0.5em',
						lineHeight: 1.3,
						'&:first-of-type': {
							marginTop: 0
						}
					},
					'& h1': { fontSize: '2em' },
					'& h2': { fontSize: '1.5em' },
					'& h3': { fontSize: '1.25em' },
					'& p': {
						marginBottom: '1em',
						'&:last-child': {
							marginBottom: 0
						}
					},
					'& ul, & ol': {
						paddingLeft: '1.5em',
						marginBottom: '1em'
					},
					'& li': {
						marginBottom: '0.25em'
					},
					'& blockquote': {
						borderLeft: '4px solid',
						borderColor: 'primary.main',
						paddingLeft: '1em',
						margin: '1em 0',
						fontStyle: 'italic',
						bgcolor: 'grey.50',
						padding: '1em'
					},
					'& pre': {
						bgcolor: 'grey.100',
						padding: '1em',
						borderRadius: '8px',
						fontFamily: 'monospace',
						fontSize: '14px',
						overflow: 'auto',
						margin: '1em 0'
					},
					'& code': {
						bgcolor: 'grey.100',
						padding: '0.2em 0.4em',
						borderRadius: '4px',
						fontFamily: 'monospace',
						fontSize: '14px'
					},
					'& a': {
						color: 'primary.main',
						textDecoration: 'none',
						'&:hover': {
							textDecoration: 'underline'
						}
					},
					'& img': {
						maxWidth: '100%',
						height: 'auto',
						borderRadius: '8px',
						margin: '1em 0'
					},
					'& strong, & b': {
						fontWeight: 700
					},
					'& em, & i': {
						fontStyle: 'italic'
					},
					'& u': {
						textDecoration: 'underline'
					}
				}}
			/>

			{/* Footer with tips */}
			<Box
													component="div"
													
				
				sx={{
					px: 2,
					py: 1,
					bgcolor: 'grey.50',
					borderTop: '1px solid',
					borderColor: 'divider'
				}}
			>
				<Typography variant="caption" color="text.secondary">
					💡 Pro tip: Use **bold**, *italic*, and markdown-style formatting. Press Ctrl+B for bold, Ctrl+I for italic.
				</Typography>
			</Box>
		</Paper>
	);
};

export default RichTextEditor;

