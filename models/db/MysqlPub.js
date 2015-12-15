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
	 * 连接数据库
	 */
	dbhandle : function() {
		var connection  = mysql.createConnection(options);
		return  connection;
	},
	/**
	 * 释放数据库连接
	 */
	release : function(connection) {
		connection.end(function(error) {
			console.log('Connection closed');
		});
	}
};