(module
  (memory (export "memory") 64)

  (func (export "grayscale") (param $ptr i32) (param $len i32)
    (local $i i32)
    (local $r i32)
    (local $g i32)
    (local $b i32)
    (local $luma i32)
    (local.set $i (i32.const 0))
    (block $break
      (loop $loop
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))
        (local.set $r (i32.load8_u (i32.add (local.get $ptr) (local.get $i))))
        (local.set $g (i32.load8_u (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 1)))))
        (local.set $b (i32.load8_u (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 2)))))
        (local.set $luma
          (i32.shr_u
            (i32.add
              (i32.add
                (i32.mul (local.get $r) (i32.const 77))
                (i32.mul (local.get $g) (i32.const 150)))
              (i32.mul (local.get $b) (i32.const 29)))
            (i32.const 8)))
        (i32.store8 (i32.add (local.get $ptr) (local.get $i)) (local.get $luma))
        (i32.store8 (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 1))) (local.get $luma))
        (i32.store8 (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 2))) (local.get $luma))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        br $loop
      )
    )
  )

  (func (export "brightness") (param $ptr i32) (param $len i32) (param $delta i32)
    (local $i i32)
    (local $p i32)
    (local $c i32)
    (local.set $i (i32.const 0))
    (block $break
      (loop $loop
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $p (i32.add (local.get $ptr) (local.get $i)))
        (local.set $c (i32.add (i32.load8_u (local.get $p)) (local.get $delta)))
        (if (i32.gt_s (local.get $c) (i32.const 255)) (then (local.set $c (i32.const 255))))
        (if (i32.lt_s (local.get $c) (i32.const 0)) (then (local.set $c (i32.const 0))))
        (i32.store8 (local.get $p) (local.get $c))

        (local.set $p (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 1))))
        (local.set $c (i32.add (i32.load8_u (local.get $p)) (local.get $delta)))
        (if (i32.gt_s (local.get $c) (i32.const 255)) (then (local.set $c (i32.const 255))))
        (if (i32.lt_s (local.get $c) (i32.const 0)) (then (local.set $c (i32.const 0))))
        (i32.store8 (local.get $p) (local.get $c))

        (local.set $p (i32.add (local.get $ptr) (i32.add (local.get $i) (i32.const 2))))
        (local.set $c (i32.add (i32.load8_u (local.get $p)) (local.get $delta)))
        (if (i32.gt_s (local.get $c) (i32.const 255)) (then (local.set $c (i32.const 255))))
        (if (i32.lt_s (local.get $c) (i32.const 0)) (then (local.set $c (i32.const 0))))
        (i32.store8 (local.get $p) (local.get $c))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        br $loop
      )
    )
  )
)
