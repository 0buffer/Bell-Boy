/*
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#include <linux/types.h>
#include <linux/i2c.h>

void i2cReadBlockData(int fd, __u8 address, __u8 length, __u8 *values);
void i2cWriteByteData(int fd, __u8 address, __u8 value);
int MPU6050_setup(void);
void MPU6050_read_fifo_data(int dfd, float *values);
int MPU6050_read_fifo_count(int dfd);
int MPU6050_get_calibration_values(float *gyro, float *results);


#define MPU6050_RA_XG_OFFS_TC 0x00
#define MPU6050_RA_YG_OFFS_TC 0x01
#define MPU6050_RA_ZG_OFFS_TC 0x02
#define MPU6050_RA_X_FINE_GAIN 0x03
#define MPU6050_RA_Y_FINE_GAIN 0x04
#define MPU6050_RA_Z_FINE_GAIN 0x05
#define MPU6050_RA_XA_OFFS_H 0x06
#define MPU6050_RA_XA_OFFS_L_TC 0x07
#define MPU6050_RA_YA_OFFS_H 0x08
#define MPU6050_RA_YA_OFFS_L_TC 0x09
#define MPU6050_RA_ZA_OFFS_H 0x0A
#define MPU6050_RA_ZA_OFFS_L_TC 0x0B
#define MPU6050_RA_XG_OFFS_USRH 0x13
#define MPU6050_RA_XG_OFFS_USRL 0x14
#define MPU6050_RA_YG_OFFS_USRH 0x15
#define MPU6050_RA_YG_OFFS_USRL 0x16
#define MPU6050_RA_ZG_OFFS_USRH 0x17
#define MPU6050_RA_ZG_OFFS_USRL 0x18
#define MPU6050_RA_SMPLRT_DIV 0x19
#define MPU6050_RA_CONFIG 0x1A
#define MPU6050_RA_GYRO_CONFIG 0x1B
#define MPU6050_RA_ACCEL_CONFIG 0x1C
#define MPU6050_RA_FIFO_EN 0x23
#define MPU6050_RA_INT_STATUS 0x3A
#define MPU6050_RA_ACCEL_XOUT_H 0x3B
#define MPU6050_RA_ACCEL_XOUT_L 0x3C
#define MPU6050_RA_ACCEL_YOUT_H 0x3D
#define MPU6050_RA_ACCEL_YOUT_L 0x3E
#define MPU6050_RA_ACCEL_ZOUT_H 0x3F
#define MPU6050_RA_ACCEL_ZOUT_L 0x40
#define MPU6050_RA_TEMP_OUT_H 0x41
#define MPU6050_RA_TEMP_OUT_L 0x42
#define MPU6050_RA_GYRO_XOUT_H 0x43
#define MPU6050_RA_GYRO_XOUT_L 0x44
#define MPU6050_RA_GYRO_YOUT_H 0x45
#define MPU6050_RA_GYRO_YOUT_L 0x46
#define MPU6050_RA_GYRO_ZOUT_H 0x47
#define MPU6050_RA_GYRO_ZOUT_L 0x48
#define MPU6050_RA_SIGNAL_PATH_RESET 0x68
#define MPU6050_RA_USER_CTRL 0x6A
#define MPU6050_RA_PWR_MGMT_1 0x6B
#define MPU6050_RA_PWR_MGMT_2 0x6C
#define MPU6050_RA_FIFO_COUNTH 0x72
#define MPU6050_RA_FIFO_COUNTL 0x73
#define MPU6050_RA_FIFO_R_W 0x74
#define MPU6050_RA_WHO_AM_I 0x75

#define MPU6050_VDDIO_LEVEL_VLOGIC 0
#define MPU6050_VDDIO_LEVEL_VDD 1

#define MPU6050_DLPF_BW_256 0x00
#define MPU6050_DLPF_BW_188 0x01
#define MPU6050_DLPF_BW_98 0x02
#define MPU6050_DLPF_BW_42 0x03
#define MPU6050_DLPF_BW_20 0x04
#define MPU6050_DLPF_BW_10 0x05
#define MPU6050_DLPF_BW_5 0x06

#define MPU6050_ACCEL_SCALE_MODIFIER_2G 0x4000
#define MPU6050_ACCEL_SCALE_MODIFIER_4G 0x2000
#define MPU6050_ACCEL_SCALE_MODIFIER_8G 0x1000
#define MPU6050_ACCEL_SCALE_MODIFIER_16G 0x0800

#define MPU6050_GYRO_SCALE_MODIFIER_250DEG 131.0 
#define MPU6050_GYRO_SCALE_MODIFIER_500DEG 65.5 
#define MPU6050_GYRO_SCALE_MODIFIER_1000DEG 32.8
#define MPU6050_GYRO_SCALE_MODIFIER_2000DEG 16.4

#define MPU6050_ACCEL_FS_2 0x00
#define MPU6050_ACCEL_FS_4 0x01
#define MPU6050_ACCEL_FS_8 0x02
#define MPU6050_ACCEL_FS_16 0x03

#define MPU6050_DHPF_RESET 0x00
#define MPU6050_DHPF_5 0x01
#define MPU6050_DHPF_2P5 0x02
#define MPU6050_DHPF_1P25 0x03
#define MPU6050_DHPF_0P63 0x04
#define MPU6050_DHPF_HOLD 0x07

#define MPU6050_CLOCK_DIV_348 0x0
#define MPU6050_CLOCK_DIV_333 0x1
#define MPU6050_CLOCK_DIV_320 0x2
#define MPU6050_CLOCK_DIV_308 0x3
#define MPU6050_CLOCK_DIV_296 0x4
#define MPU6050_CLOCK_DIV_286 0x5
#define MPU6050_CLOCK_DIV_276 0x6
#define MPU6050_CLOCK_DIV_267 0x7
#define MPU6050_CLOCK_DIV_258 0x8
#define MPU6050_CLOCK_DIV_500 0x9
#define MPU6050_CLOCK_DIV_471 0xA
#define MPU6050_CLOCK_DIV_444 0xB
#define MPU6050_CLOCK_DIV_421 0xC
#define MPU6050_CLOCK_DIV_400 0xD
#define MPU6050_CLOCK_DIV_381 0xE
#define MPU6050_CLOCK_DIV_364 0xF

#define MPU6050_INTMODE_ACTIVEHIGH 0x00
#define MPU6050_INTMODE_ACTIVELOW 0x01

#define MPU6050_INTDRV_PUSHPULL 0x00
#define MPU6050_INTDRV_OPENDRAIN 0x01

#define MPU6050_INTLATCH_50USPULSE 0x00
#define MPU6050_INTLATCH_WAITCLEAR 0x01

#define MPU6050_INTCLEAR_STATUSREAD 0x00
#define MPU6050_INTCLEAR_ANYREAD 0x01

#define MPU6050_CLOCK_INTERNAL 0x00
#define MPU6050_CLOCK_PLL_XGYRO 0x01
#define MPU6050_CLOCK_PLL_YGYRO 0x02
#define MPU6050_CLOCK_PLL_ZGYRO 0x03
#define MPU6050_CLOCK_PLL_EXT32K 0x04
#define MPU6050_CLOCK_PLL_EXT19M 0x05
#define MPU6050_CLOCK_KEEP_RESET 0x07

#define MPU6050_WAKE_FREQ_1P25 0x0
#define MPU6050_WAKE_FREQ_2P5 0x1
#define MPU6050_WAKE_FREQ_5 0x2
#define MPU6050_WAKE_FREQ_10 0x3

#define MPU6050_WHO_AM_I_BIT 6
#define MPU6050_WHO_AM_I_LENGTH 6


#ifndef LIB_I2C_SMBUS_H
#define LIB_I2C_SMBUS_H

extern __s32 i2c_smbus_access(int file, char read_write, __u8 command,
			      int size, union i2c_smbus_data *data);

extern __s32 i2c_smbus_write_quick(int file, __u8 value);
extern __s32 i2c_smbus_read_byte(int file);
extern __s32 i2c_smbus_write_byte(int file, __u8 value);
extern __s32 i2c_smbus_read_byte_data(int file, __u8 command);
extern __s32 i2c_smbus_write_byte_data(int file, __u8 command, __u8 value);
extern __s32 i2c_smbus_read_word_data(int file, __u8 command);
extern __s32 i2c_smbus_write_word_data(int file, __u8 command, __u16 value);
extern __s32 i2c_smbus_process_call(int file, __u8 command, __u16 value);

/* Returns the number of read bytes */
extern __s32 i2c_smbus_read_block_data(int file, __u8 command, __u8 *values);
extern __s32 i2c_smbus_write_block_data(int file, __u8 command, __u8 length,
					const __u8 *values);

/* Returns the number of read bytes */
/* Until kernel 2.6.22, the length is hardcoded to 32 bytes. If you
   ask for less than 32 bytes, your code will only work with kernels
   2.6.23 and later. */
extern __s32 i2c_smbus_read_i2c_block_data(int file, __u8 command, __u8 length,
					   __u8 *values);
extern __s32 i2c_smbus_write_i2c_block_data(int file, __u8 command, __u8 length,
					    const __u8 *values);

/* Returns the number of read bytes */
extern __s32 i2c_smbus_block_process_call(int file, __u8 command, __u8 length,
					  __u8 *values);

#endif /* LIB_I2C_SMBUS_H */
