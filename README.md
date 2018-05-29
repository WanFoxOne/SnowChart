# SnowChart

![Prévisualisation](https://image.ibb.co/mpRz7d/Screenshot_2018_5_29.png)

```php
<?php
  $header = ['Novembre','Décembre','Janvier','Février','Mars','Avril];
  $header = ['6.70','6.4','1','6.84','6.54','6.85'];
?>

<div snowait_chart
     data-categories="<?= join('|', $header); ?>"
     data-values="<?= join('|', $body); ?>">
</div>
```
