package ru.math.spbu.server.connection

import groovy.transform.TupleConstructor

/**
 * Created by ageevdenis on 02-3-15.
 */

@TupleConstructor
class RobotConnectionInfo {

    String owner
    String secretCode
    String program
    def description
    Socket socket

    public static String getKey(String owner, String code) {
        return "$owner-$code"
    }
}