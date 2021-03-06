EESchema Schematic File Version 4
LIBS:Bell-Boy-cache
EELAYER 26 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L MCU_Microchip_ATmega:ATmega328P-AU U1
U 1 1 5C086EEC
P 4750 3200
F 0 "U1" H 4600 1700 50  0000 C CNN
F 1 "ATmega328P-AU" H 4750 1400 50  0000 C CNN
F 2 "Package_QFP:LQFP-32_7x7mm_P0.8mm" H 4750 3200 50  0001 C CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328_P%20AVR%20MCU%20with%20picoPower%20Technology%20Data%20Sheet%2040001984A.pdf" H 4750 3200 50  0001 C CNN
	1    4750 3200
	1    0    0    -1  
$EndComp
$Comp
L Regulator_Linear:TLV70012_SOT23-5 U4
U 1 1 5C099C90
P 3550 3650
F 0 "U4" H 3550 3992 50  0000 C CNN
F 1 "MAX40200" H 3550 3901 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 3550 3975 50  0001 C CIN
F 3 "http://www.ti.com/lit/ds/symlink/tlv700.pdf" H 3550 3700 50  0001 C CNN
	1    3550 3650
	1    0    0    -1  
$EndComp
$Comp
L Regulator_Linear:TLV70012_SOT23-5 U2
U 1 1 5C099CD6
P 2450 3650
F 0 "U2" H 2450 3992 50  0000 C CNN
F 1 "MAX40200" H 2450 3901 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 2450 3975 50  0001 C CIN
F 3 "http://www.ti.com/lit/ds/symlink/tlv700.pdf" H 2450 3700 50  0001 C CNN
	1    2450 3650
	1    0    0    -1  
$EndComp
$Comp
L Diode:BAT54C D1
U 1 1 5C099D57
P 4750 1300
F 0 "D1" H 4750 1525 50  0000 C CNN
F 1 "BAT54C" H 4750 1434 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23" H 4825 1425 50  0001 L CNN
F 3 "http://www.diodes.com/_files/datasheets/ds11005.pdf" H 4670 1300 50  0001 C CNN
	1    4750 1300
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR029
U 1 1 5C0B0597
P 7100 2750
F 0 "#PWR029" H 7100 2500 50  0001 C CNN
F 1 "GND" H 7105 2577 50  0000 C CNN
F 2 "" H 7100 2750 50  0001 C CNN
F 3 "" H 7100 2750 50  0001 C CNN
	1    7100 2750
	1    0    0    -1  
$EndComp
$Comp
L power:+3.3V #PWR028
U 1 1 5C0B05E8
P 7100 2350
F 0 "#PWR028" H 7100 2200 50  0001 C CNN
F 1 "+3.3V" H 7115 2523 50  0000 C CNN
F 2 "" H 7100 2350 50  0001 C CNN
F 3 "" H 7100 2350 50  0001 C CNN
	1    7100 2350
	1    0    0    -1  
$EndComp
Wire Wire Line
	7350 2350 7100 2350
Wire Wire Line
	7350 2750 7100 2750
$Comp
L power:GND #PWR020
U 1 1 5C0B0903
P 4750 4700
F 0 "#PWR020" H 4750 4450 50  0001 C CNN
F 1 "GND" H 4755 4527 50  0000 C CNN
F 2 "" H 4750 4700 50  0001 C CNN
F 3 "" H 4750 4700 50  0001 C CNN
	1    4750 4700
	1    0    0    -1  
$EndComp
Wire Wire Line
	4750 1700 4750 1600
$Comp
L Battery_Management:MCP73831-2-OT U3
U 1 1 5C0B979D
P 2400 1700
F 0 "U3" H 2400 2178 50  0000 C CNN
F 1 "MCP73831-2-OT" H 2400 2087 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 2450 1450 50  0001 L CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/20001984g.pdf" H 2250 1650 50  0001 C CNN
	1    2400 1700
	1    0    0    -1  
$EndComp
$Comp
L Device:Battery_Cell BATT1
U 1 1 5C0B994E
P 2650 2850
F 0 "BATT1" H 2768 2946 50  0000 L CNN
F 1 "Battery_Cell" H 2768 2855 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" V 2650 2910 50  0001 C CNN
F 3 "~" V 2650 2910 50  0001 C CNN
	1    2650 2850
	1    0    0    -1  
$EndComp
$Comp
L Device:LED_Dual_2pin LED1
U 1 1 5C0E6D9B
P 6250 950
F 0 "LED1" V 6204 1208 50  0000 L CNN
F 1 "LED_Dual_2pin" V 6295 1208 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 6250 950 50  0001 C CNN
F 3 "~" H 6250 950 50  0001 C CNN
	1    6250 950 
	0    1    1    0   
$EndComp
$Comp
L Device:R R1
U 1 1 5C0E70E4
P 5950 1250
F 0 "R1" V 5743 1250 50  0000 C CNN
F 1 "82R" V 5834 1250 50  0000 C CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 5880 1250 50  0001 C CNN
F 3 "~" H 5950 1250 50  0001 C CNN
	1    5950 1250
	0    1    1    0   
$EndComp
Wire Wire Line
	5600 1250 5800 1250
Wire Wire Line
	6100 1250 6250 1250
Wire Wire Line
	5800 1150 5800 650 
Wire Wire Line
	5800 650  6250 650 
$Comp
L power:GND #PWR027
U 1 1 5C0E752E
P 6300 4900
F 0 "#PWR027" H 6300 4650 50  0001 C CNN
F 1 "GND" H 6305 4727 50  0000 C CNN
F 2 "" H 6300 4900 50  0001 C CNN
F 3 "" H 6300 4900 50  0001 C CNN
	1    6300 4900
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR026
U 1 1 5C0E7566
P 6050 4900
F 0 "#PWR026" H 6050 4650 50  0001 C CNN
F 1 "GND" H 6055 4727 50  0000 C CNN
F 2 "" H 6050 4900 50  0001 C CNN
F 3 "" H 6050 4900 50  0001 C CNN
	1    6050 4900
	1    0    0    -1  
$EndComp
Wire Wire Line
	6550 5100 6450 5100
Wire Wire Line
	6450 5100 6450 4900
Wire Wire Line
	6450 4900 6300 4900
Wire Wire Line
	6550 5000 6550 4850
Wire Wire Line
	6550 4850 6050 4850
Wire Wire Line
	6050 4850 6050 4900
$Comp
L power:VDDA #PWR022
U 1 1 5C0E7A9A
P 5850 4950
F 0 "#PWR022" H 5850 4800 50  0001 C CNN
F 1 "VDDA" H 5867 5123 50  0000 C CNN
F 2 "" H 5850 4950 50  0001 C CNN
F 3 "" H 5850 4950 50  0001 C CNN
	1    5850 4950
	1    0    0    -1  
$EndComp
Wire Wire Line
	6550 5200 5850 5200
Wire Wire Line
	5850 5200 5850 4950
$Comp
L power:VDDA #PWR019
U 1 1 5C0E7E2C
P 4450 1550
F 0 "#PWR019" H 4450 1400 50  0001 C CNN
F 1 "VDDA" H 4467 1723 50  0000 C CNN
F 2 "" H 4450 1550 50  0001 C CNN
F 3 "" H 4450 1550 50  0001 C CNN
	1    4450 1550
	1    0    0    -1  
$EndComp
Connection ~ 4750 1550
Wire Wire Line
	4750 1550 4750 1500
$Comp
L power:GND #PWR06
U 1 1 5C0E8808
P 2300 2950
F 0 "#PWR06" H 2300 2700 50  0001 C CNN
F 1 "GND" H 2305 2777 50  0000 C CNN
F 2 "" H 2300 2950 50  0001 C CNN
F 3 "" H 2300 2950 50  0001 C CNN
	1    2300 2950
	1    0    0    -1  
$EndComp
Wire Wire Line
	2300 2950 2650 2950
$Comp
L power:+BATT #PWR05
U 1 1 5C0E8CB5
P 2300 2650
F 0 "#PWR05" H 2300 2500 50  0001 C CNN
F 1 "+BATT" H 2315 2823 50  0000 C CNN
F 2 "" H 2300 2650 50  0001 C CNN
F 3 "" H 2300 2650 50  0001 C CNN
	1    2300 2650
	1    0    0    -1  
$EndComp
Wire Wire Line
	2650 2650 2300 2650
$Comp
L power:+5V #PWR018
U 1 1 5C0EA0EF
P 4400 1300
F 0 "#PWR018" H 4400 1150 50  0001 C CNN
F 1 "+5V" H 4415 1473 50  0000 C CNN
F 2 "" H 4400 1300 50  0001 C CNN
F 3 "" H 4400 1300 50  0001 C CNN
	1    4400 1300
	1    0    0    -1  
$EndComp
Wire Wire Line
	4400 1300 4450 1300
Wire Wire Line
	5750 5300 5750 3700
Wire Wire Line
	5750 3700 5350 3700
Wire Wire Line
	5350 3800 5650 3800
Wire Wire Line
	5650 3800 5650 5400
$Comp
L Device:R R5
U 1 1 5C0ED7E3
P 5900 3350
F 0 "R5" H 5830 3304 50  0000 R CNN
F 1 "10K" H 5830 3395 50  0000 R CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 5830 3350 50  0001 C CNN
F 3 "~" H 5900 3350 50  0001 C CNN
	1    5900 3350
	-1   0    0    1   
$EndComp
$Comp
L power:VDDA #PWR025
U 1 1 5C0EE193
P 5900 3100
F 0 "#PWR025" H 5900 2950 50  0001 C CNN
F 1 "VDDA" H 5917 3273 50  0000 C CNN
F 2 "" H 5900 3100 50  0001 C CNN
F 3 "" H 5900 3100 50  0001 C CNN
	1    5900 3100
	1    0    0    -1  
$EndComp
Wire Wire Line
	5900 3200 5900 3100
$Comp
L Device:C C1
U 1 1 5C0EEA52
P 5900 3650
F 0 "C1" H 6015 3696 50  0000 L CNN
F 1 "100n" H 6015 3605 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 5938 3500 50  0001 C CNN
F 3 "~" H 5900 3650 50  0001 C CNN
	1    5900 3650
	1    0    0    -1  
$EndComp
Wire Wire Line
	4850 1700 4850 1600
Wire Wire Line
	4850 1600 4750 1600
Connection ~ 4750 1600
Wire Wire Line
	4750 1600 4750 1550
$Comp
L Device:C C4
U 1 1 5C0F17CB
P 3850 1550
F 0 "C4" H 3965 1596 50  0000 L CNN
F 1 "4u7" H 3965 1505 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 3888 1400 50  0001 C CNN
F 3 "~" H 3850 1550 50  0001 C CNN
	1    3850 1550
	1    0    0    -1  
$EndComp
$Comp
L Device:C C3
U 1 1 5C0F187F
P 4150 1550
F 0 "C3" H 4265 1596 50  0000 L CNN
F 1 "100n" H 4265 1505 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 4188 1400 50  0001 C CNN
F 3 "~" H 4150 1550 50  0001 C CNN
	1    4150 1550
	1    0    0    -1  
$EndComp
Wire Wire Line
	3850 1400 4150 1400
Wire Wire Line
	4150 1400 4400 1400
Wire Wire Line
	4400 1400 4400 1550
Connection ~ 4150 1400
Wire Wire Line
	3850 1700 4000 1700
$Comp
L power:GND #PWR017
U 1 1 5C0F42D3
P 4000 1800
F 0 "#PWR017" H 4000 1550 50  0001 C CNN
F 1 "GND" H 4005 1627 50  0000 C CNN
F 2 "" H 4000 1800 50  0001 C CNN
F 3 "" H 4000 1800 50  0001 C CNN
	1    4000 1800
	1    0    0    -1  
$EndComp
Wire Wire Line
	4000 1800 4000 1700
Connection ~ 4000 1700
Wire Wire Line
	4000 1700 4150 1700
$Comp
L Device:C C2
U 1 1 5C0F78C7
P 3650 2000
F 0 "C2" V 3398 2000 50  0000 C CNN
F 1 "100n" V 3489 2000 50  0000 C CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 3688 1850 50  0001 C CNN
F 3 "~" H 3650 2000 50  0001 C CNN
	1    3650 2000
	0    1    1    0   
$EndComp
$Comp
L power:GND #PWR014
U 1 1 5C0F792A
P 3350 2000
F 0 "#PWR014" H 3350 1750 50  0001 C CNN
F 1 "GND" H 3355 1827 50  0000 C CNN
F 2 "" H 3350 2000 50  0001 C CNN
F 3 "" H 3350 2000 50  0001 C CNN
	1    3350 2000
	1    0    0    -1  
$EndComp
Wire Wire Line
	3350 2000 3500 2000
Wire Wire Line
	3800 2000 4150 2000
Wire Wire Line
	4400 1550 4450 1550
Wire Wire Line
	4450 1550 4750 1550
Connection ~ 4450 1550
$Comp
L power:GND #PWR08
U 1 1 5C0FD098
P 2600 2000
F 0 "#PWR08" H 2600 1750 50  0001 C CNN
F 1 "GND" H 2605 1827 50  0000 C CNN
F 2 "" H 2600 2000 50  0001 C CNN
F 3 "" H 2600 2000 50  0001 C CNN
	1    2600 2000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR015
U 1 1 5C102FDC
P 3550 4000
F 0 "#PWR015" H 3550 3750 50  0001 C CNN
F 1 "GND" H 3555 3827 50  0000 C CNN
F 2 "" H 3550 4000 50  0001 C CNN
F 3 "" H 3550 4000 50  0001 C CNN
	1    3550 4000
	1    0    0    -1  
$EndComp
Wire Wire Line
	3550 3950 3550 4000
Wire Wire Line
	3850 3550 4150 3550
$Comp
L power:+5V #PWR013
U 1 1 5C1093B0
P 3100 3550
F 0 "#PWR013" H 3100 3400 50  0001 C CNN
F 1 "+5V" H 3115 3723 50  0000 C CNN
F 2 "" H 3100 3550 50  0001 C CNN
F 3 "" H 3100 3550 50  0001 C CNN
	1    3100 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	3100 3550 3250 3550
Wire Wire Line
	2400 2000 2600 2000
Wire Wire Line
	4150 3550 4150 2450
Wire Wire Line
	4150 2450 3650 2450
Wire Wire Line
	3200 2450 3200 1200
Wire Wire Line
	3200 1200 2400 1200
Wire Wire Line
	2400 1200 2400 1400
$Comp
L power:+BATT #PWR010
U 1 1 5C114A8F
P 3000 1600
F 0 "#PWR010" H 3000 1450 50  0001 C CNN
F 1 "+BATT" H 3015 1773 50  0000 C CNN
F 2 "" H 3000 1600 50  0001 C CNN
F 3 "" H 3000 1600 50  0001 C CNN
	1    3000 1600
	1    0    0    -1  
$EndComp
Wire Wire Line
	2800 1600 3000 1600
$Comp
L Device:R R3
U 1 1 5C1168BC
P 1700 1800
F 0 "R3" V 1493 1800 50  0000 C CNN
F 1 "4.7k" V 1584 1800 50  0000 C CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 1630 1800 50  0001 C CNN
F 3 "~" H 1700 1800 50  0001 C CNN
	1    1700 1800
	0    1    1    0   
$EndComp
$Comp
L power:GND #PWR01
U 1 1 5C116B36
P 1350 1800
F 0 "#PWR01" H 1350 1550 50  0001 C CNN
F 1 "GND" H 1355 1627 50  0000 C CNN
F 2 "" H 1350 1800 50  0001 C CNN
F 3 "" H 1350 1800 50  0001 C CNN
	1    1350 1800
	1    0    0    -1  
$EndComp
Wire Wire Line
	1350 1800 1550 1800
Wire Wire Line
	1850 1800 2000 1800
$Comp
L power:+BATT #PWR04
U 1 1 5C125307
P 1950 3550
F 0 "#PWR04" H 1950 3400 50  0001 C CNN
F 1 "+BATT" H 1965 3723 50  0000 C CNN
F 2 "" H 1950 3550 50  0001 C CNN
F 3 "" H 1950 3550 50  0001 C CNN
	1    1950 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	1950 3550 2150 3550
$Comp
L power:+5V #PWR09
U 1 1 5C130659
P 2950 3550
F 0 "#PWR09" H 2950 3400 50  0001 C CNN
F 1 "+5V" H 2965 3723 50  0000 C CNN
F 2 "" H 2950 3550 50  0001 C CNN
F 3 "" H 2950 3550 50  0001 C CNN
	1    2950 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 3550 2950 3550
$Comp
L power:GND #PWR07
U 1 1 5C1328BD
P 2450 4000
F 0 "#PWR07" H 2450 3750 50  0001 C CNN
F 1 "GND" H 2455 3827 50  0000 C CNN
F 2 "" H 2450 4000 50  0001 C CNN
F 3 "" H 2450 4000 50  0001 C CNN
	1    2450 4000
	1    0    0    -1  
$EndComp
Wire Wire Line
	2450 3950 2450 4000
Wire Wire Line
	5350 3900 5550 3900
Wire Wire Line
	5550 3900 5550 5400
Wire Wire Line
	5550 5400 2150 5400
Wire Wire Line
	2150 5400 2150 4200
Wire Wire Line
	3250 3650 3250 4200
Wire Wire Line
	3250 5300 5450 5300
Wire Wire Line
	5450 5300 5450 4000
Wire Wire Line
	5450 4000 5350 4000
$Comp
L power:+VSW #PWR02
U 1 1 5C13D8AB
P 1350 2650
F 0 "#PWR02" H 1350 2500 50  0001 C CNN
F 1 "+VSW" H 1365 2823 50  0000 C CNN
F 2 "" H 1350 2650 50  0001 C CNN
F 3 "" H 1350 2650 50  0001 C CNN
	1    1350 2650
	1    0    0    -1  
$EndComp
$Comp
L Switch:SW_DIP_x01 SW1
U 1 1 5C140316
P 1850 2650
F 0 "SW1" H 1850 2917 50  0000 C CNN
F 1 "SW_DIP_x01" H 1850 2826 50  0000 C CNN
F 2 "Button_Switch_THT:SW_Tactile_SPST_Angled_PTS645Vx39-2LFS" H 1850 2650 50  0001 C CNN
F 3 "" H 1850 2650 50  0001 C CNN
	1    1850 2650
	1    0    0    -1  
$EndComp
Wire Wire Line
	2150 2650 2300 2650
Connection ~ 2300 2650
Wire Wire Line
	1550 2650 1350 2650
$Comp
L power:+VSW #PWR021
U 1 1 5C14ADCB
P 5150 1300
F 0 "#PWR021" H 5150 1150 50  0001 C CNN
F 1 "+VSW" H 5165 1473 50  0000 C CNN
F 2 "" H 5150 1300 50  0001 C CNN
F 3 "" H 5150 1300 50  0001 C CNN
	1    5150 1300
	1    0    0    -1  
$EndComp
Connection ~ 5900 3500
Wire Wire Line
	5350 3500 5900 3500
$Comp
L power:+3.3V #PWR023
U 1 1 5C150BF1
P 6550 1550
F 0 "#PWR023" H 6550 1400 50  0001 C CNN
F 1 "+3.3V" H 6565 1723 50  0000 C CNN
F 2 "" H 6550 1550 50  0001 C CNN
F 3 "" H 6550 1550 50  0001 C CNN
	1    6550 1550
	1    0    0    -1  
$EndComp
Wire Wire Line
	5600 1250 5600 2100
Wire Wire Line
	5600 2100 5350 2100
Wire Wire Line
	5500 1150 5500 2000
Wire Wire Line
	5500 2000 5350 2000
Wire Wire Line
	5500 1150 5800 1150
$Comp
L power:GND #PWR024
U 1 1 5C174EB8
P 5900 2050
F 0 "#PWR024" H 5900 1800 50  0001 C CNN
F 1 "GND" H 5905 1877 50  0000 C CNN
F 2 "" H 5900 2050 50  0001 C CNN
F 3 "" H 5900 2050 50  0001 C CNN
	1    5900 2050
	1    0    0    -1  
$EndComp
$Comp
L Device:R R4
U 1 1 5C174E5D
P 5900 1800
F 0 "R4" H 5970 1846 50  0000 L CNN
F 1 "100k" H 5970 1755 50  0000 L CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 5830 1800 50  0001 C CNN
F 3 "~" H 5900 1800 50  0001 C CNN
	1    5900 1800
	1    0    0    -1  
$EndComp
Wire Wire Line
	5900 1950 5900 2050
$Comp
L Device:C C6
U 1 1 5C1D21CD
P 3650 2650
F 0 "C6" H 3765 2696 50  0000 L CNN
F 1 "4u7" H 3765 2605 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 3688 2500 50  0001 C CNN
F 3 "~" H 3650 2650 50  0001 C CNN
	1    3650 2650
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR016
U 1 1 5C1D2253
P 3650 2900
F 0 "#PWR016" H 3650 2650 50  0001 C CNN
F 1 "GND" H 3655 2727 50  0000 C CNN
F 2 "" H 3650 2900 50  0001 C CNN
F 3 "" H 3650 2900 50  0001 C CNN
	1    3650 2900
	1    0    0    -1  
$EndComp
Wire Wire Line
	3650 2800 3650 2900
Wire Wire Line
	3650 2500 3650 2450
Connection ~ 3650 2450
Wire Wire Line
	3650 2450 3200 2450
$Comp
L Device:C C5
U 1 1 5C1D7A5B
P 3000 1800
F 0 "C5" H 3115 1846 50  0000 L CNN
F 1 "4u7" H 3115 1755 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 3038 1650 50  0001 C CNN
F 3 "~" H 3000 1800 50  0001 C CNN
	1    3000 1800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR011
U 1 1 5C1D7AB7
P 3000 2000
F 0 "#PWR011" H 3000 1750 50  0001 C CNN
F 1 "GND" H 3005 1827 50  0000 C CNN
F 2 "" H 3000 2000 50  0001 C CNN
F 3 "" H 3000 2000 50  0001 C CNN
	1    3000 2000
	1    0    0    -1  
$EndComp
Wire Wire Line
	3000 1950 3000 2000
Wire Wire Line
	3000 1650 3000 1600
Connection ~ 3000 1600
Wire Wire Line
	5050 1300 5150 1300
Wire Wire Line
	2800 1800 2800 2650
Wire Wire Line
	2800 2650 3450 2650
Wire Wire Line
	3450 2650 3450 3250
Wire Wire Line
	3450 3250 4050 3250
Wire Wire Line
	4050 3250 4050 4950
Wire Wire Line
	4050 4950 5350 4950
Wire Wire Line
	5350 4950 5350 4400
$Comp
L Device:R R6
U 1 1 5C19EFCD
P 3050 4350
F 0 "R6" H 3120 4396 50  0000 L CNN
F 1 "10K" H 3120 4305 50  0000 L CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 2980 4350 50  0001 C CNN
F 3 "~" H 3050 4350 50  0001 C CNN
	1    3050 4350
	1    0    0    -1  
$EndComp
$Comp
L Device:R R2
U 1 1 5C19F059
P 1900 4350
F 0 "R2" H 1970 4396 50  0000 L CNN
F 1 "10K" H 1970 4305 50  0000 L CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 1830 4350 50  0001 C CNN
F 3 "~" H 1900 4350 50  0001 C CNN
	1    1900 4350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR012
U 1 1 5C19F136
P 3050 4500
F 0 "#PWR012" H 3050 4250 50  0001 C CNN
F 1 "GND" H 3055 4327 50  0000 C CNN
F 2 "" H 3050 4500 50  0001 C CNN
F 3 "" H 3050 4500 50  0001 C CNN
	1    3050 4500
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR03
U 1 1 5C19F190
P 1900 4500
F 0 "#PWR03" H 1900 4250 50  0001 C CNN
F 1 "GND" H 1905 4327 50  0000 C CNN
F 2 "" H 1900 4500 50  0001 C CNN
F 3 "" H 1900 4500 50  0001 C CNN
	1    1900 4500
	1    0    0    -1  
$EndComp
Wire Wire Line
	1900 4200 2150 4200
Connection ~ 2150 4200
Wire Wire Line
	2150 4200 2150 3650
Wire Wire Line
	3050 4200 3250 4200
Connection ~ 3250 4200
Wire Wire Line
	3250 4200 3250 5300
$Comp
L Connector_Generic:Conn_02x16_Odd_Even J4
U 1 1 5C4CE854
P 7550 3050
F 0 "J4" H 7600 3967 50  0000 C CNN
F 1 "Conn_02x16_Odd_Even" H 7600 3876 50  0000 C CNN
F 2 "Connector_PinSocket_2.54mm:PinSocket_2x16_P2.54mm_Vertical_SMD" H 7550 3050 50  0001 C CNN
F 3 "~" H 7550 3050 50  0001 C CNN
	1    7550 3050
	1    0    0    -1  
$EndComp
Wire Wire Line
	5900 3800 5900 5500
Wire Wire Line
	5900 5500 6550 5500
$Comp
L Connector_Generic:Conn_01x06 J2
U 1 1 5C4E705B
P 6750 5200
F 0 "J2" H 6830 5192 50  0000 L CNN
F 1 "Conn_01x06" H 6830 5101 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x06_P2.54mm_Vertical" H 6750 5200 50  0001 C CNN
F 3 "~" H 6750 5200 50  0001 C CNN
	1    6750 5200
	1    0    0    -1  
$EndComp
Wire Wire Line
	5350 4100 6700 4100
Wire Wire Line
	6700 4100 6700 1900
$Comp
L Connector_Generic:Conn_01x04 J3
U 1 1 5C4FA73F
P 6450 2600
F 0 "J3" H 6530 2592 50  0000 L CNN
F 1 "Conn_01x04" H 6530 2501 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x04_P2.54mm_Vertical" H 6450 2600 50  0001 C CNN
F 3 "~" H 6450 2600 50  0001 C CNN
	1    6450 2600
	1    0    0    -1  
$EndComp
Wire Wire Line
	6550 1550 6550 1600
Wire Wire Line
	5350 2900 5750 2900
Wire Wire Line
	5750 2900 5750 1600
Wire Wire Line
	5750 1600 5900 1600
Wire Wire Line
	5900 1600 5900 1650
Wire Wire Line
	5350 2300 6150 2300
Wire Wire Line
	6150 2300 6150 2600
Wire Wire Line
	6150 2600 6250 2600
Wire Wire Line
	5350 2400 6050 2400
Wire Wire Line
	6050 2400 6050 2700
Wire Wire Line
	6050 2700 6250 2700
Wire Wire Line
	5350 2500 5950 2500
Wire Wire Line
	5950 2500 5950 2800
Wire Wire Line
	5950 2800 6250 2800
Wire Wire Line
	5350 4200 6900 4200
Wire Wire Line
	6900 4200 6900 2650
Wire Wire Line
	6900 2650 7350 2650
$Comp
L power:GND #PWR030
U 1 1 5C55EFCE
P 7250 3550
F 0 "#PWR030" H 7250 3300 50  0001 C CNN
F 1 "GND" H 7255 3377 50  0000 C CNN
F 2 "" H 7250 3550 50  0001 C CNN
F 3 "" H 7250 3550 50  0001 C CNN
	1    7250 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	7250 3550 7350 3550
Wire Wire Line
	6850 2450 7350 2450
Wire Wire Line
	8800 1900 8550 1900
Wire Wire Line
	6950 2550 7350 2550
Wire Wire Line
	8850 3650 8400 3650
Wire Wire Line
	8400 3650 8400 1800
Wire Wire Line
	9400 1400 9500 1400
$Comp
L power:+3.3V #PWR0101
U 1 1 5C5ED2FB
P 9500 1250
F 0 "#PWR0101" H 9500 1100 50  0001 C CNN
F 1 "+3.3V" H 9515 1423 50  0000 C CNN
F 2 "" H 9500 1250 50  0001 C CNN
F 3 "" H 9500 1250 50  0001 C CNN
	1    9500 1250
	1    0    0    -1  
$EndComp
Wire Wire Line
	9500 1400 9500 1250
Connection ~ 9500 1400
Wire Wire Line
	9500 1400 9600 1400
Wire Wire Line
	9450 3250 9550 3250
$Comp
L power:+3.3V #PWR0102
U 1 1 5C5F7340
P 9550 3250
F 0 "#PWR0102" H 9550 3100 50  0001 C CNN
F 1 "+3.3V" H 9565 3423 50  0000 C CNN
F 2 "" H 9550 3250 50  0001 C CNN
F 3 "" H 9550 3250 50  0001 C CNN
	1    9550 3250
	1    0    0    -1  
$EndComp
Connection ~ 9550 3250
Wire Wire Line
	9550 3250 9650 3250
$Comp
L power:GND #PWR0105
U 1 1 5C60C724
P 9800 2800
F 0 "#PWR0105" H 9800 2550 50  0001 C CNN
F 1 "GND" H 9805 2627 50  0000 C CNN
F 2 "" H 9800 2800 50  0001 C CNN
F 3 "" H 9800 2800 50  0001 C CNN
	1    9800 2800
	1    0    0    -1  
$EndComp
Wire Wire Line
	9500 2800 9800 2800
$Comp
L power:GND #PWR0106
U 1 1 5C611DFA
P 10000 4650
F 0 "#PWR0106" H 10000 4400 50  0001 C CNN
F 1 "GND" H 10005 4477 50  0000 C CNN
F 2 "" H 10000 4650 50  0001 C CNN
F 3 "" H 10000 4650 50  0001 C CNN
	1    10000 4650
	1    0    0    -1  
$EndComp
Wire Wire Line
	9550 4650 10000 4650
$Comp
L power:GND #PWR0107
U 1 1 5C6175DE
P 8250 2300
F 0 "#PWR0107" H 8250 2050 50  0001 C CNN
F 1 "GND" H 8255 2127 50  0000 C CNN
F 2 "" H 8250 2300 50  0001 C CNN
F 3 "" H 8250 2300 50  0001 C CNN
	1    8250 2300
	1    0    0    -1  
$EndComp
Wire Wire Line
	8250 2300 8800 2300
Wire Wire Line
	8400 1800 8800 1800
Wire Wire Line
	8850 3750 8550 3750
Wire Wire Line
	8550 3750 8550 1900
$Comp
L power:GND #PWR0108
U 1 1 5C632B81
P 8050 4200
F 0 "#PWR0108" H 8050 3950 50  0001 C CNN
F 1 "GND" H 8055 4027 50  0000 C CNN
F 2 "" H 8050 4200 50  0001 C CNN
F 3 "" H 8050 4200 50  0001 C CNN
	1    8050 4200
	1    0    0    -1  
$EndComp
Wire Wire Line
	8850 4150 8050 4150
Wire Wire Line
	8050 4150 8050 4200
$Comp
L power:GND #PWR0109
U 1 1 5C638701
P 10250 1350
F 0 "#PWR0109" H 10250 1100 50  0001 C CNN
F 1 "GND" H 10255 1177 50  0000 C CNN
F 2 "" H 10250 1350 50  0001 C CNN
F 3 "" H 10250 1350 50  0001 C CNN
	1    10250 1350
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR0110
U 1 1 5C63875E
P 10250 1050
F 0 "#PWR0110" H 10250 900 50  0001 C CNN
F 1 "+3V3" H 10265 1223 50  0000 C CNN
F 2 "" H 10250 1050 50  0001 C CNN
F 3 "" H 10250 1050 50  0001 C CNN
	1    10250 1050
	1    0    0    -1  
$EndComp
$Comp
L Device:C C7
U 1 1 5C638889
P 10050 1200
F 0 "C7" H 10165 1246 50  0000 L CNN
F 1 "10n" H 10165 1155 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10088 1050 50  0001 C CNN
F 3 "~" H 10050 1200 50  0001 C CNN
	1    10050 1200
	1    0    0    -1  
$EndComp
$Comp
L Device:C C10
U 1 1 5C638917
P 10450 1200
F 0 "C10" H 10565 1246 50  0000 L CNN
F 1 "100n" H 10565 1155 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10488 1050 50  0001 C CNN
F 3 "~" H 10450 1200 50  0001 C CNN
	1    10450 1200
	1    0    0    -1  
$EndComp
Wire Wire Line
	10050 1350 10250 1350
Connection ~ 10250 1350
Wire Wire Line
	10250 1350 10450 1350
Wire Wire Line
	10050 1050 10250 1050
Connection ~ 10250 1050
Wire Wire Line
	10250 1050 10450 1050
$Comp
L power:+3V3 #PWR0111
U 1 1 5C644700
P 10450 3200
F 0 "#PWR0111" H 10450 3050 50  0001 C CNN
F 1 "+3V3" H 10465 3373 50  0000 C CNN
F 2 "" H 10450 3200 50  0001 C CNN
F 3 "" H 10450 3200 50  0001 C CNN
	1    10450 3200
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0112
U 1 1 5C6447B6
P 10450 3500
F 0 "#PWR0112" H 10450 3250 50  0001 C CNN
F 1 "GND" H 10455 3327 50  0000 C CNN
F 2 "" H 10450 3500 50  0001 C CNN
F 3 "" H 10450 3500 50  0001 C CNN
	1    10450 3500
	1    0    0    -1  
$EndComp
$Comp
L Device:C C8
U 1 1 5C644810
P 10250 3350
F 0 "C8" H 10365 3396 50  0000 L CNN
F 1 "10n" H 10365 3305 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10288 3200 50  0001 C CNN
F 3 "~" H 10250 3350 50  0001 C CNN
	1    10250 3350
	1    0    0    -1  
$EndComp
$Comp
L Device:C C12
U 1 1 5C644874
P 10650 3350
F 0 "C12" H 10765 3396 50  0000 L CNN
F 1 "100n" H 10765 3305 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10688 3200 50  0001 C CNN
F 3 "~" H 10650 3350 50  0001 C CNN
	1    10650 3350
	1    0    0    -1  
$EndComp
Wire Wire Line
	10250 3200 10450 3200
Connection ~ 10450 3200
Wire Wire Line
	10450 3200 10650 3200
Wire Wire Line
	10250 3500 10450 3500
Connection ~ 10450 3500
Wire Wire Line
	10450 3500 10650 3500
$Comp
L power:+5V #PWR0114
U 1 1 5C657409
P 8050 2350
F 0 "#PWR0114" H 8050 2200 50  0001 C CNN
F 1 "+5V" H 8065 2523 50  0000 C CNN
F 2 "" H 8050 2350 50  0001 C CNN
F 3 "" H 8050 2350 50  0001 C CNN
	1    8050 2350
	1    0    0    -1  
$EndComp
Wire Wire Line
	7850 2350 8050 2350
$Comp
L Device:C C14
U 1 1 5C65DB60
P 10850 1200
F 0 "C14" H 10965 1246 50  0000 L CNN
F 1 "2.2uf" H 10965 1155 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10888 1050 50  0001 C CNN
F 3 "~" H 10850 1200 50  0001 C CNN
	1    10850 1200
	1    0    0    -1  
$EndComp
$Comp
L Device:C C11
U 1 1 5C6648F1
P 10450 4400
F 0 "C11" H 10565 4446 50  0000 L CNN
F 1 "100n" H 10565 4355 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10488 4250 50  0001 C CNN
F 3 "~" H 10450 4400 50  0001 C CNN
	1    10450 4400
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0116
U 1 1 5C664961
P 10450 4550
F 0 "#PWR0116" H 10450 4300 50  0001 C CNN
F 1 "GND" H 10455 4377 50  0000 C CNN
F 2 "" H 10450 4550 50  0001 C CNN
F 3 "" H 10450 4550 50  0001 C CNN
	1    10450 4550
	1    0    0    -1  
$EndComp
Wire Wire Line
	10250 4250 10450 4250
$Comp
L Device:C C9
U 1 1 5C66B39B
P 10400 2550
F 0 "C9" H 10515 2596 50  0000 L CNN
F 1 "100n" H 10515 2505 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 10438 2400 50  0001 C CNN
F 3 "~" H 10400 2550 50  0001 C CNN
	1    10400 2550
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0117
U 1 1 5C66B441
P 10400 2700
F 0 "#PWR0117" H 10400 2450 50  0001 C CNN
F 1 "GND" H 10405 2527 50  0000 C CNN
F 2 "" H 10400 2700 50  0001 C CNN
F 3 "" H 10400 2700 50  0001 C CNN
	1    10400 2700
	1    0    0    -1  
$EndComp
Wire Wire Line
	10200 2400 10400 2400
$Comp
L power:+3.3V #PWR0118
U 1 1 5C6723B1
P 7150 3150
F 0 "#PWR0118" H 7150 3000 50  0001 C CNN
F 1 "+3.3V" H 7165 3323 50  0000 C CNN
F 2 "" H 7150 3150 50  0001 C CNN
F 3 "" H 7150 3150 50  0001 C CNN
	1    7150 3150
	1    0    0    -1  
$EndComp
Wire Wire Line
	7150 3150 7350 3150
Wire Wire Line
	6950 2550 6950 3400
Wire Wire Line
	6950 3400 5350 3400
Wire Wire Line
	5350 3300 6850 3300
Wire Wire Line
	6850 3300 6850 2450
Wire Wire Line
	5750 5300 6550 5300
Wire Wire Line
	5650 5400 6550 5400
$Comp
L power:+VSW #PWR0119
U 1 1 5C6B0E9E
P 7250 4250
F 0 "#PWR0119" H 7250 4100 50  0001 C CNN
F 1 "+VSW" H 7265 4423 50  0000 C CNN
F 2 "" H 7250 4250 50  0001 C CNN
F 3 "" H 7250 4250 50  0001 C CNN
	1    7250 4250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5350 4300 6900 4300
Wire Wire Line
	7250 4300 7250 4250
$Comp
L Sensor_Motion:ICM-20689 U6
U 1 1 5C5E5596
P 9550 3950
F 0 "U6" H 9550 3164 50  0000 C CNN
F 1 "ICM-20689" H 9550 3073 50  0000 C CNN
F 2 "Sensor_Motion:InvenSense_QFN-24_4x4mm_P0.5mm" H 9550 3150 50  0001 C CNN
F 3 "" H 9550 3800 50  0001 C CNN
	1    9550 3950
	1    0    0    -1  
$EndComp
$Comp
L Device:C C13
U 1 1 5C650DC6
P 11050 3350
F 0 "C13" H 11165 3396 50  0000 L CNN
F 1 "2.2uF" H 11165 3305 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric_Pad1.42x1.75mm_HandSolder" H 11088 3200 50  0001 C CNN
F 3 "~" H 11050 3350 50  0001 C CNN
	1    11050 3350
	1    0    0    -1  
$EndComp
Wire Wire Line
	10650 3200 11050 3200
Connection ~ 10650 3200
Wire Wire Line
	10650 3500 11050 3500
Connection ~ 10650 3500
Wire Wire Line
	10450 1050 10850 1050
Connection ~ 10450 1050
Wire Wire Line
	10450 1350 10850 1350
Connection ~ 10450 1350
$Comp
L Sensor_Motion:ICM-20689 U5
U 1 1 5C63BAD1
P 9500 2100
F 0 "U5" H 9500 1314 50  0000 C CNN
F 1 "ICM-20689" H 9500 1223 50  0000 C CNN
F 2 "Sensor_Motion:InvenSense_QFN-24_4x4mm_P0.5mm" H 9500 1300 50  0001 C CNN
F 3 "" H 9500 1950 50  0001 C CNN
	1    9500 2100
	1    0    0    -1  
$EndComp
Wire Wire Line
	7350 3250 7050 3250
Wire Wire Line
	7050 3250 7050 4450
Wire Wire Line
	7050 4450 8400 4450
Wire Wire Line
	8400 4450 8400 3650
Connection ~ 8400 3650
Wire Wire Line
	8850 3850 8650 3850
Wire Wire Line
	8650 3850 8650 2000
Wire Wire Line
	8650 2000 8800 2000
Wire Wire Line
	8650 3850 8650 4650
Wire Wire Line
	8650 4650 7100 4650
Wire Wire Line
	7100 4650 7100 3350
Wire Wire Line
	7100 3350 7350 3350
Connection ~ 8650 3850
Wire Wire Line
	7350 3450 7150 3450
Wire Wire Line
	7150 3450 7150 4800
Wire Wire Line
	7150 4800 8550 4800
Wire Wire Line
	8550 4800 8550 3750
Connection ~ 8550 3750
Wire Wire Line
	7850 3450 8800 3450
Wire Wire Line
	8800 3450 8800 2400
Wire Wire Line
	7850 3550 8200 3550
Wire Wire Line
	8200 3550 8200 4250
Wire Wire Line
	8200 4250 8850 4250
$Comp
L Device:R R7
U 1 1 5C6B9C72
P 7450 5100
F 0 "R7" H 7520 5146 50  0000 L CNN
F 1 "100K" H 7520 5055 50  0000 L CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 7380 5100 50  0001 C CNN
F 3 "~" H 7450 5100 50  0001 C CNN
	1    7450 5100
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0103
U 1 1 5C6B9D7A
P 7450 5250
F 0 "#PWR0103" H 7450 5000 50  0001 C CNN
F 1 "GND" H 7455 5077 50  0000 C CNN
F 2 "" H 7450 5250 50  0001 C CNN
F 3 "" H 7450 5250 50  0001 C CNN
	1    7450 5250
	1    0    0    -1  
$EndComp
Wire Wire Line
	7450 4950 6900 4950
Wire Wire Line
	6900 4950 6900 4300
Connection ~ 6900 4300
Wire Wire Line
	6900 4300 7250 4300
$Comp
L Connector:Conn_01x01_Male J1
U 1 1 5C6BDA35
P 6500 1900
F 0 "J1" H 6606 2078 50  0000 C CNN
F 1 "Conn_01x01_Male" H 6606 1987 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x01_P2.54mm_Vertical" H 6500 1900 50  0001 C CNN
F 3 "~" H 6500 1900 50  0001 C CNN
	1    6500 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	6250 2500 6100 2500
Wire Wire Line
	6100 2500 6100 3500
Wire Wire Line
	6100 3500 5900 3500
$Comp
L Device:R R8
U 1 1 5C70F5D5
P 6400 1600
F 0 "R8" V 6193 1600 50  0000 C CNN
F 1 "100k" V 6284 1600 50  0000 C CNN
F 2 "Resistor_SMD:R_1206_3216Metric_Pad1.42x1.75mm_HandSolder" V 6330 1600 50  0001 C CNN
F 3 "~" H 6400 1600 50  0001 C CNN
	1    6400 1600
	0    1    1    0   
$EndComp
Wire Wire Line
	6250 1600 5900 1600
Connection ~ 5900 1600
$EndSCHEMATC
