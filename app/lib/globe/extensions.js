; (function (undefined) {
	var emptyArray = [],
	slice = emptyArray.slice;

	if (!String.format) {
		String.format = function (format, params) {
			var args = _.isArray(params) ? params : slice.call(arguments, 1);

			return format.replace(/{(\d+)}/g, function (match, number) {
				return args[number] !== undefined ? args[number] : '';
			});
		};
	}

	String.isEqualToString = function isEqualToString(a, b) {
		return $.trim(a).toLowerCase() == $.trim(b).toLowerCase();
	}

})();
