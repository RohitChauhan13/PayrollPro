import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Work from "./Work";
import Dashboard from "./Dashboard";
import Attendance from "./Attendance";
import Employee from "./Employee";
import Rate from "./Rate";
import Salary from "./Salary";
import AddWork from "./AddWork";
import Commission from "./Commission";
import AddAttendance from "./addAttendance";
import ViewAttendance from "./ViewAttendance";
import AttendanceReport from "./AttendanceReport";
import ViewWork from "./ViewWork";
import UpdateAttendance from "./UpdateAttendance";
import CalculateSalary from "./CalculateSalary";
import SalaryReport from "./SalaryReport";
import AddCommission from "./AddCommission";
import ViewCommission from "./ViewCommission";
import TotalSalary from "./TotalSalary";

const Stack = createNativeStackNavigator();

const Routes = () => {
    return(
        <Stack.Navigator 
            screenOptions={{headerShown: false, animation: 'slide_from_right'}}
            initialRouteName="Dashboard"
        >
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Work" component={Work} />
            <Stack.Screen name="Attendance" component={Attendance} />
            <Stack.Screen name="Employee" component={Employee} />
            <Stack.Screen name="Rate" component={Rate} />
            <Stack.Screen name="Salary" component={Salary} />
            <Stack.Screen name="Commission" component={Commission} />
            <Stack.Screen name="AddWork" component={AddWork} />
            <Stack.Screen name="AddAttendance" component={AddAttendance} />
            <Stack.Screen name="ViewAttendance" component={ViewAttendance} />
            <Stack.Screen name="AttendanceReport" component={AttendanceReport} />
            <Stack.Screen name="ViewWork" component={ViewWork} />
            <Stack.Screen name="UpdateAttendance" component={UpdateAttendance} />
            <Stack.Screen name="CalculateSalary" component={CalculateSalary} />
            <Stack.Screen name="SalaryReport" component={SalaryReport} />
            <Stack.Screen name="AddCommission" component={AddCommission} />
            <Stack.Screen name="ViewCommission" component={ViewCommission} />
            <Stack.Screen name="TotalSalary" component={TotalSalary} />
        </Stack.Navigator>
    )
}

export default Routes;