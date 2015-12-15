/**
 * Created by Administrator on 2015/10/27.
 */
var mysql      = require('mysql');
var settings = require("./settings");

var options = {
	'host': settings.dbhost,
	'port': settings.port,
	'user': settings.user,
	'password': settings.password,
	'database': settings.database,
	'charset': settings.charset,
	'connectionLimit': settings.maxConnLimit,
	'supportBigNumbers': true,
	'bigNumberStrings': true
};

exports.dbh ={
	/**
	 * �������ݿ�
	 */
	dbhandle : function() {
		var connection  = mysql.createConnection(options);
		return  connection;
	},
	/**
	 * �ͷ����ݿ�����
	 */
	release : function(connection) {
		connection.end(function(error) {
			console.log('Connection closed');
		});
	}
};