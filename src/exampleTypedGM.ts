const fn = () => {
	return () => GM.getValue('test', 'a default value');
};

export default fn();
