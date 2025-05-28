<?php
$host='localhost';
$user='root';
$pass='';
$db='student';

//create connection
$conn=new mysqli($host,$user,$pass,$db);
echo 'connection success...';

$cna=$_POST['cna'];
$cfe=$_POST['cfe'];
$cad=$_POST['cad'];

$sql="insert into stud(s_name,s_con,s_add) values('$cna','$cfe','$cad')";

$res=$conn->query($sql);

if($res==TRUE)
{
    echo '<br>Data insertion Success...';
}
else
{
    echo 'Error...';
}

$conn->close();
?>
